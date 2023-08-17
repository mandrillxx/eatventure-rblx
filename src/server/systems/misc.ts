import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Body, Speech } from "shared/components";

function misc(world: World, _: ServerState) {
	for (const [id, speech] of world.queryChanged(Speech)) {
		if (!speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			body.DialogGui.DialogFrame.DialogText.Text = speech.new.text;
			body.DialogGui.Enabled = true;
		}
		if (speech.old && !speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			body.DialogGui.DialogFrame.DialogText.Text = "";
			body.DialogGui.Enabled = false;
		}
		if (speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			body.DialogGui.DialogFrame.DialogText.Text = speech.new.text;
		}
	}
}

export = misc;
