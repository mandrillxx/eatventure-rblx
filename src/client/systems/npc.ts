import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { World } from "@rbxts/matter";
import { ClientState } from "shared/clientState";
import { Body, NPC, Wants } from "shared/components";
import { Network } from "shared/network";

function npc(world: World, _: ClientState) {
	const maid = new Maid();
	for (const [id, body] of world.queryChanged(Body)) {
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
