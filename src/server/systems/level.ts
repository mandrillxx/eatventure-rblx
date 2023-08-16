import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState, _Level } from "server/index.server";
import { BelongsTo, NPC, Renderable, Transform } from "shared/components";
import { Level, OpenStatus, OwnedBy } from "shared/components/level";

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
