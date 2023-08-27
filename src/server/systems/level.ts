import {
	HasUtilities,
	Destination,
	OccupiedBy,
	Renderable,
	OpenStatus,
	BelongsTo,
	Transform,
	OwnedBy,
	Utility,
	Product,
	Level,
	Body,
	NPC,
} from "shared/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ComponentInfo, getOrError } from "shared/util";
import { ServerState, _Level } from "server/index.server";
import { World, useThrottle } from "@rbxts/matter";
import { handleUpgrade } from "server/components/levelUpgrade";
import { Upgrades } from "shared/upgrades";
import { Foods } from "shared/globals";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";

function level(world: World, state: ServerState) {
	for (const [id, level, ownedBy] of world.query(Level, OwnedBy).without(Renderable)) {
		const player = ownedBy.player as BasePlayer;
		let levelModel = ReplicatedStorage.Assets.Levels.FindFirstChild(level.name) as BaseLevel;
		if (!levelModel) {
			Log.Error("Level {@LevelName} does not have a representative asset", level.name);
			continue;
		}
		levelModel = levelModel.Clone();
		levelModel.PivotTo(levelModel.GetPivot().add(new Vector3(0, 0, state.playerIndex * 40)));
		state.playerIndex++;

		const destinations: ComponentInfo<typeof Destination>[] = [];
		for (const child of levelModel.CustomerAnchors.GetChildren()) {
			const parent = New("Model")({
				Name: child.Name,
				Parent: child.Parent,
			});
			child.Parent = parent;
			parent.PrimaryPart = child as BasePart;
			if (child.Name === "Spawn" || !child.IsA("BasePart")) continue;
			const destination = Destination({
				destination: child.Position,
				instance: child,
				type: "customer",
			});
			const componentId = world.spawn(
				destination,
				BelongsTo({ playerId: ownedBy.playerId, levelId: id }),
				Renderable({ model: parent }),
			);
			destinations.push({ componentId, component: destination });
		}
		for (const child of levelModel.EmployeeAnchors.GetChildren()) {
			const parent = New("Model")({
				Name: child.Name,
				Parent: child.Parent,
			});
			child.Parent = parent;
			parent.PrimaryPart = child as BasePart;
			if (child.Name === "Spawn" || !child.IsA("BasePart")) continue;
			const destination = Destination({
				destination: child.Position,
				instance: child,
				type: "employee",
			});
			const componentId = world.spawn(
				destination,
				BelongsTo({ playerId: ownedBy.playerId, levelId: id }),
				Renderable({ model: parent }),
			);
			destinations.push({ componentId, component: destination });
		}
		const newDestinations = level.patch({ destinations });

		const profile = state.profiles.get(player);
		if (!profile) {
			Log.Error("Could not find profile for player");
			continue;
		}

		for (const upgrade of Upgrades) {
			handleUpgrade(true, upgrade, player, ownedBy.playerId, id, world, state);
		}

		task.spawn(() =>
			world.insert(
				id,
				level.patch({
					destinations: newDestinations.destinations,
					nextAvailableDestination() {
						Log.Info("Finding next available destination");
						for (const destination of destinations) {
							if (!world.contains(destination.componentId)) continue;
							const occupiedBy = world.get(destination.componentId, OccupiedBy);
							if (destination.component.type === "customer" && !occupiedBy) {
								return destination;
							}
						}
					},
				}),
			),
		);

		levelModel.Name = `${level.name}_${player.UserId}`;
		levelModel.SetAttribute("Owner", player.UserId);
		levelModel.Parent = Workspace.Levels;

		world.insert(
			id,
			Renderable({ model: levelModel }),
			Transform({
				cf: levelModel.GetPivot(),
			}),
			OpenStatus({
				open: false,
			}),
		);
		if (!world.contains(id)) continue;
		const model = getOrError(world, id, Renderable, "Level does not have Renderable component");

		const utilities: { utility: Utility; model: BaseUtility }[] = [];
		for (const utility of levelModel.Utilities.GetChildren()) {
			const upgradeGui = ReplicatedStorage.Assets.UpgradeGui.Clone() as UpgradeGuiInstance;
			upgradeGui.Adornee = utility as Model;
			upgradeGui.Parent = utility;
			const utilModel = utility as BaseUtility;
			const product = utilModel.Makes.Value as Foods;
			const amount = utilModel.Amount.Value;
			const utilLevel = player.Utilities.FindFirstChild(utility.Name) as IntValue | undefined;
			const xpLevel = utilLevel
				? utilLevel.Value
				: New("IntValue")({
						Name: "XPLevel",
						Value: 1,
						Parent: utilModel,
				  }).Value;
			const every = utilModel.Every.Value / (xpLevel >= 50 ? 2 : 1);
			const orderDelay = utilModel.OrderDelay.Value;
			const reward = utilModel.Reward.Value;
			const weight = utilModel.Weight.Value;
			const baseUpgradeCost = utilModel.BaseUpgrade.Value;
			const utilityComponent = Utility({
				type: utility.Name,
				unlocked: true,
				makes: Product({ product, amount }),
				every,
				level: { componentId: id, component: level },
				xpLevel,
				weight,
				baseUpgradeCost,
				orderDelay,
				reward,
			});
			const utilityId = world.spawn(
				utilityComponent,
				BelongsTo({
					playerId: ownedBy.playerId,
					levelId: id,
				}),
				Renderable({
					model: utility as BaseUtility,
				}),
			);
			utility.SetAttribute("serverId", utilityId);
			utilities.push({
				utility: utilityComponent,
				model: utility as BaseUtility,
			});
			world.insert(
				id,
				HasUtilities({
					utilities,
				}),
			);
		}

		const _level: _Level = {
			model,
			levelId: id,
		};
		state.levels.set(player.UserId, _level);
	}

	if (useThrottle(2)) {
		for (const [id, occupiedBy] of world.query(OccupiedBy)) {
			if (!world.contains(occupiedBy.entityId)) {
				if (state.verbose)
					Log.Warn(
						"OccupiedBy entity {@OccupiedBy} does not exist but was occupying, clearing destination",
						occupiedBy.entityId,
					);
				world.remove(id, OccupiedBy);
			}
		}
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (!npc.old && npc.new) {
			if (!world.contains(id)) continue;
			const belongsTo = getOrError(world, id, BelongsTo, "NPC does not have BelongsTo component");
			const level = getOrError(world, belongsTo.levelId, Level);
			const { spawnRate, maxCustomers, maxEmployees } = level;
			const npcType = npc.new.type;
			let customers = 0,
				employees = 0;
			for (const [_id, _npc, _belongsTo] of world.query(NPC, BelongsTo)) {
				if (_belongsTo.levelId !== belongsTo.levelId) continue;
				const _level = getOrError(world, _belongsTo.levelId, Level);
				if (level.name === _level.name) {
					if (_npc.type === "customer") customers++;
					if (_npc.type === "employee") employees++;
				}
			}
			const finalCustomers = customers;
			const finalEmployees = employees;
			if (state.verbose)
				Log.Warn(
					"Spawn Rate: {@SpawnRate} | Customers: {@Customers}/{@MaxCustomers} Employees: {@Employees}/{@MaxEmployees}",
					spawnRate,
					customers,
					maxCustomers,
					employees,
					maxEmployees,
				);
			if (npcType === "customer" && finalCustomers > maxCustomers) {
				world.despawn(id);
				if (state.verbose) Log.Warn("Despawning {@NPC} due to max customers", npc.new.type);
				continue;
			} else if (npcType === "employee" && finalEmployees > maxEmployees) {
				world.despawn(id);
				if (state.verbose) Log.Warn("Despawning {@NPC} due to max employees", npc.new.type);
				continue;
			}
		}
	}

	for (const [id, level] of world.queryChanged(Level)) {
		if (level.old && !level.new) {
			for (const [_id, belongsTo] of world.query(BelongsTo)) {
				if (belongsTo.levelId === id) {
					world.despawn(_id);
				}
			}
		}
		if (level.old && level.new && level.old.employeePace !== level.new.employeePace) {
			if (state.debug)
				Log.Warn("Employee pace changed from {@Old} to {@New}", level.old.employeePace, level.new.employeePace);
			for (const [_id, npc, body, belongsTo] of world.query(NPC, Body, BelongsTo)) {
				if (npc.type === "employee" && belongsTo.levelId === _id) {
					if (state.debug)
						Log.Warn("Setting {@NPC} walk speed to {@WalkSpeed}", npc.type, level.new.employeePace);
					body.model.Humanoid.WalkSpeed = level.new.employeePace;
				}
			}
		}
	}

	for (const [id, openStatus] of world.queryChanged(OpenStatus)) {
		if (openStatus.new && !openStatus.new.open) {
			if (!world.contains(id)) continue;
			const ownedBy = getOrError(world, id, OwnedBy, "Level does not have OwnedBy component");
			for (const [id, npc, belongsTo] of world.query(NPC, BelongsTo)) {
				if (belongsTo.playerId === ownedBy.playerId) {
					if (state.verbose) Log.Debug("Npc {@NPC} belongs to {@BelongsTo}", npc, belongsTo.levelId);
					if (world.contains(id) && npc.type !== "employee") world.despawn(id);
				}
			}
		}
	}
}

export = level;
