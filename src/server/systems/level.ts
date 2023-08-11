import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Renderable } from "shared/components";
import { Level as LevelComp } from "shared/components/level";

function level(world: World, _: ServerState, ui: Widgets) {
	for (const [id, level] of world.query(LevelComp).without(Renderable)) {
		// Log.Info("Found {@id}, {@Level} without renderable", id, level.name);
		const model = ReplicatedStorage.Assets.Levels.FindFirstChild(level.name)!.Clone() as Level;
		model.Parent = Workspace.Levels;

		world.insert(
			id,
			Renderable({
				model,
			}),
		);
	}

	for (const [id, level] of world.query(LevelComp)) {
		ui.heading(`Level ${id}`);
		ui.label(`NPCs: ${level.npcs.size()}`);
		ui.label(`Products: ${level.products.size()}`);
	}
}

export = level;
