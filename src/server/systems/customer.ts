import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Body, NPC, Wants } from "shared/components";

function customer(world: World, _: ServerState) {
	for (const [id, wants] of world.queryChanged(Wants)) {
		if (wants.old && wants.new) {
			if (!world.contains(id)) return;
			const npc = world.get(id, NPC);
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			body.DialogGui.DialogFrame.DialogText.Text = `I want ${wants.new.product.amount}x ${wants.new.product.product}`;
			body.DialogGui.Enabled = true;
		}
		if (wants.old && !wants.new) {
			if (!world.contains(id)) return;
			const npc = world.get(id, NPC);
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			body.DialogGui.DialogFrame.DialogText.Text = "Thanks!";
			task.delay(2, () => (body.DialogGui.Enabled = false));
		}
		if (!wants.old && wants.new) {
			task.delay(1, () => {
				if (!world.contains(id)) return;
				const npc = world.get(id, NPC);
				const body = world.get(id, Body)?.model as BaseNPC;
				if (!npc || !body) {
					Log.Error("No NPC or Body component for customer");
					return;
				}
				body.DialogGui.DialogFrame.DialogText.Text = `I want ${wants.new!.product.amount}x ${
					wants.new!.product.product
				}`;
				body.DialogGui.Enabled = true;
			});
		}
	}
}

export = customer;
