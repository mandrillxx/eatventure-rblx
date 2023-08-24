import { BelongsTo, Body, NPC } from "shared/components";
import { ClientState } from "shared/clientState";
import { World } from "@rbxts/matter";
import Maid from "@rbxts/maid";

function npc(world: World, state: ClientState) {
	const maid = new Maid();
	for (const [id, body] of world.queryChanged(Body)) {
		if (!world.contains(id)) continue;
		const belongsTo = world.get(id, BelongsTo);
		if (!belongsTo || belongsTo.playerId !== state.playerId) continue;

		if (!body.old && body.new) {
			const npc = world.get(id, NPC);
			if (!npc || npc.type !== "customer") continue;
			const model = body.new.model as BaseNPC;
			maid.GiveTask(
				model.ClickDetector.MouseHoverEnter.Connect(() => {
					model.HoverSelection.Visible = true;
				}),
			);
			maid.GiveTask(
				model.ClickDetector.MouseHoverLeave.Connect(() => {
					model.HoverSelection.Visible = false;
				}),
			);
		}
		if (body.old && !body.new) {
			maid.DoCleaning();
		}
	}
}

export = npc;
