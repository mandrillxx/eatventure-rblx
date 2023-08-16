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
			maid.GiveTask(
				model.ClickDetector.MouseClick.Connect(() => {
					const wants = world.get(id, Wants);
					if (!wants) {
						Log.Error("NPC {@NPC} does not want anything", id);
						return;
					}
					if (!world.contains(id)) return;
					Network.provide.client.fire(id);
				}),
			);
		}
		if (body.old && !body.new) {
			maid.DoCleaning();
		}
	}
}

export = npc;
