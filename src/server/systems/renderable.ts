import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Renderable } from "shared/components";

function renderable(world: World, _: ServerState) {
	for (const [id, model] of world.query(Renderable)) {
		if (!model.model.IsDescendantOf(game)) {
			world.remove(id, Renderable);
		}
	}

	for (const [_id, model] of world.queryChanged(Renderable)) {
		if (model.old && model.old.model && !model.new) {
			model.old.model.Destroy();
		}
	}
}

export = renderable;
