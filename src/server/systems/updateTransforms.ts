import { World } from "@rbxts/matter";
import { Renderable, Transform } from "shared/components";

function updateTransforms(world: World) {
	for (const [id, transform] of world.queryChanged(Transform)) {
		const model = world.get(id, Renderable);

		if (model && transform.new && !transform.new.doNotReconcile) {
			model.model.PivotTo(transform.new.cf);
		}
	}

	for (const [id, model] of world.queryChanged(Renderable)) {
		const transform = world.get(id, Transform);

		if (transform && model.new) {
			model.new.model.PivotTo(transform.cf);
		}
	}

	for (const [id, model, transform] of world.query(Renderable, Transform)) {
		if (model.model.PrimaryPart?.Anchored) continue;

		const existingCFrame = transform.cf;
		const currentCFrame = model.model.PrimaryPart!.CFrame;

		if (currentCFrame !== existingCFrame) {
			world.insert(
				id,
				Transform({
					cf: currentCFrame,
					doNotReconcile: true,
				}),
			);
		}
	}
}

export = updateTransforms;
