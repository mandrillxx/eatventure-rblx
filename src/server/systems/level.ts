import {
	BelongsTo,
	NPC,
	Renderable,
	Transform,
	Level,
	OpenStatus,
	OwnedBy,
	Utility,
	Product,
	HasUtilities,
	Body,
	Destination,
} from "shared/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState, _Level } from "server/index.server";
import { AnyEntity, World } from "@rbxts/matter";
import { makes } from "shared/components/level";
import Log from "@rbxts/log";
import { New } from "@rbxts/fusion";

function level(world: World, state: ServerState) {
	for (const [id, level, ownedBy] of world.query(Level, OwnedBy).without(Renderable)) {
		let levelModel = ReplicatedStorage.Assets.Levels.FindFirstChild(level.name) as BaseLevel;
		if (!levelModel) {
			Log.Error("Level {@LevelName} does not have a representative asset", level.name);
			continue;
		}

		const destinations: { destinationId: AnyEntity; destination: Destination }[] = [];
		for (const child of levelModel.CustomerAnchors.GetChildren()) {
			const parent = New("Model")({
				Name: child.Name,
				Parent: child.Parent,
				PrimaryPart: child as BasePart,
			});
			child.Parent = parent;
			if (child.Name === "Spawn" || !child.IsA("BasePart")) continue;
			const destination = Destination({
				destination: child.Position,
				instance: child,
				type: "customer",
			});
			const destinationId = world.spawn(destination, Renderable({ model: parent }));
			destinations.push({ destinationId, destination });
		}
		for (const child of levelModel.EmployeeAnchors.GetChildren()) {
			const parent = New("Model")({
				Name: child.Name,
				Parent: child.Parent,
				PrimaryPart: child as BasePart,
			});
			child.Parent = parent;
			if (child.Name === "Spawn" || !child.IsA("BasePart")) continue;
			const destination = Destination({
				destination: child.Position,
				instance: child,
				type: "employee",
			});
			const destinationId = world.spawn(destination, Renderable({ model: parent }));
			destinations.push({ destinationId, destination });
		}
		world.insert(
			id,
			level.patch({
				destinations: [...level.destinations, ...destinations],
				nextAvailableDestination(npcType) {
					for (const destination of destinations) {
						if (destination.destination.type === npcType && !destination.destination.occupiedBy) {
							return destination;
						}
					}
				},
			}),
		);

		levelModel = levelModel.Clone();
		levelModel.Name = `${level.name}_${ownedBy.player.UserId}`;
		levelModel.SetAttribute("Owner", ownedBy.player.UserId);
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
		const model = world.get(id, Renderable);
		if (!model) {
			Log.Error("Level {@LevelName} encountered a fatal error", level.name);
			continue;
		}

		const utilities: { utility: Utility; model: Model }[] = [];
		for (const utility of levelModel.Utilities.GetChildren()) {
			const product = makes.find((x) => utility.Name === x.utilityName);
			if (!product) {
				Log.Error("Utility {@UtilityName} does not have a representative product", utility.Name);
				continue;
			}
			const utilityComponent = Utility({
				type: utility.Name,
				unlocked: true,
				makes: Product({ product: product.makes, amount: product.amount }),
				every: product.every,
				level,
			});
			const utilityId = world.spawn(
				utilityComponent,
				Renderable({
					model: utility as Model,
				}),
			);
			utilities.push({
				utility: utilityComponent,
				model: utility as Model,
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
		state.levels.set(ownedBy.player.UserId, _level);
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (!npc.old && npc.new) {
			const belongsTo = world.get(id, BelongsTo);
			if (!belongsTo) {
				Log.Error("NPC {@NPC} could not be found, bypass check", npc);
				continue;
			}
			const { spawnRate, maxCustomers, maxEmployees } = belongsTo.level;
			const npcType = npc.new.type;
			let customers = 0,
				employees = 0;
			for (const [_id, _npc, _belongsTo] of world.query(NPC, BelongsTo)) {
				if (belongsTo.level === _belongsTo.level) {
					if (_npc.type === "customer") customers++;
					if (_npc.type === "employee") employees++;
					continue;
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

	for (const [_id, level] of world.queryChanged(Level)) {
		if (level.old && level.new && level.old.employeePace !== level.new.employeePace) {
			Log.Warn("Employee pace changed from {@Old} to {@New}", level.old.employeePace, level.new.employeePace);
			for (const [_id, npc, body, belongsTo] of world.query(NPC, Body, BelongsTo)) {
				if (npc.type === "employee" && belongsTo.level.name === level.new.name) {
					Log.Warn("Setting {@NPC} walk speed to {@WalkSpeed}", npc.type, level.new.employeePace);
					body.model.Humanoid.WalkSpeed = level.new.employeePace;
				}
			}
		}
	}

	for (const [id, openStatus] of world.queryChanged(OpenStatus)) {
		if (openStatus.new && !openStatus.new.open) {
			const level = world.get(id, Level);
			const ownedBy = world.get(id, OwnedBy);
			if (!level || !ownedBy) {
				Log.Error("Level could not be found");
				continue;
			}
			for (const [id, npc, belongsTo] of world.query(NPC, BelongsTo)) {
				if (belongsTo.client.player.UserId === ownedBy.player.UserId) {
					if (state.verbose) Log.Debug("Npc {@NPC} belongs to {@BelongsTo}", npc, belongsTo.level.name);
					if (world.contains(id) && npc.type !== "employee") world.despawn(id);
				}
			}
		}
	}
}

export = level;
