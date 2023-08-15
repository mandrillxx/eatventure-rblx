import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Body, NPC, Wants } from "shared/components";

function customer(world: World, _: ServerState) {
	for (const [id, wants] of world.queryChanged(Wants)) {
		if (!wants.old && wants.new) {
			Log.Info(`v Wants ${id} | ${wants.new.product.amount}x ${wants.new.product.product}`);
			task.delay(1, () => {
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
		if (wants.old && wants.new) {
			Log.Info(`x Wants ${id} | ${wants.new.product.amount}x ${wants.new.product.product}`);
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
			const npc = world.get(id, NPC);
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			body.DialogGui.DialogFrame.DialogText.Text = "Thanks!";
			task.wait(2);
			body.DialogGui.Enabled = false;
		}
	}
}

export = customer;
