import { World } from "@rbxts/matter";
import { Renderable } from "shared/components";

function removeModels(world: World) {
	for (const [id, renderable] of world.query(Renderable)) {
		if (!renderable.model.IsDescendantOf(game)) {
			world.remove(id, Renderable);
		}
	}
}

export = removeModels;
