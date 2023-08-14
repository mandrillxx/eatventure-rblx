import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Renderable } from "shared/components";
import { Level } from "shared/components/level";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";

function level(world: World, state: ServerState, ui: Widgets) {
	for (const [_id, level] of world.queryChanged(Level)) {
		if (!level.old && level.new) {
			const world = start([script.Parent!, ReplicatedStorage.Shared.systems], state)(setupTags);
			const LevelModel = ReplicatedStorage.Assets.Levels.Level1;
			const Level = level.new;
			const worldInfo: WorldInfo = {
				...world,
				Level,
				LevelModel,
			};

			state.levels.set(level.new.name, worldInfo);
		} else if (level.old && !level.new) {
			state.levels.delete(level.old.name);
		}
	}

	for (const [id, level] of world.query(Level).without(Renderable)) {
		const model = ReplicatedStorage.Assets.Levels.FindFirstChild(level.name)!.Clone() as BaseLevel;
		model.Parent = Workspace.Levels;

		world.insert(
			id,
			Renderable({
				model,
			}),
		);
	}

	for (const [id, level] of world.query(Level)) {
		ui.heading(`Level id: ${id} name: ${level.name}`);
		ui.label(`NPCs: ${level.npcs.size()}`);
		ui.label(`Products: ${level.products.size()}`);
	}
}

export = level;
