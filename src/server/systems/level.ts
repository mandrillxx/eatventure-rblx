import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState, _Level } from "server/index.server";
import { BelongsTo, NPC, Renderable, Transform, Level, OpenStatus, OwnedBy } from "shared/components";

function level(world: World, state: ServerState) {
	for (const [id, level, ownedBy] of world.query(Level, OwnedBy).without(Renderable)) {
		let levelModel = ReplicatedStorage.Assets.Levels.FindFirstChild(level.name) as BaseLevel;
		if (!levelModel) {
			Log.Error("Level {@LevelName} does not have a representative asset", level.name);
			continue;
		}

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

		const _level: _Level = {
			model,
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
					Log.Debug("Npc {@NPC} belongs to {@BelongsTo}", npc, belongsTo.level.name);
					world.despawn(id);
				}
			}
		}
	}
}

export = level;
