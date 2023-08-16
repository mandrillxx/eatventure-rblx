import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ClientState } from "shared/clientState";
import { Body, NPC, Renderable } from "shared/components";

function npc(world: World, _: ClientState) {
	// for (const [id, npc] of world.queryChanged(NPC)) {
	// 	if (!npc.old && npc.new) {
	// 		Log.Warn("NPC {@NPC} is new", npc.new);
	// 		if (world.get(id, Body)) continue;
	// 		const renderable = world.get(id, Renderable);
	// 		if (!renderable) {
	// 			Log.Error("NPC {@NPC} does not have a renderable component", npc.new);
	// 			return;
	// 		}
	// 		const model = renderable.model as BaseNPC;
	// 		world.insert(
	// 			id,
	// 			Body({
	// 				model,
	// 			}),
	// 		);
	// 	}
	// }

	for (const [_id, body] of world.queryChanged(Body)) {
		if (!body.old && body.new) {
			const model = body.new.model as BaseNPC;
			model.ClickDetector.MouseHoverEnter.Connect(() => {
				model.HoverSelection.Visible = true;
			});
		}
		if (body.old && !body.new) {
			const model = body.old.model as BaseNPC;
			model.ClickDetector.MouseHoverLeave.Connect(() => {
				model.HoverSelection.Visible = false;
			});
		}
	}
}

export = npc;
