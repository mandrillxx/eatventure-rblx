import { ServerState } from "server/index.server";
import { radialObject } from "shared/radial";
import { Body, Speech } from "shared/components";
import { World } from "@rbxts/matter";

function misc(world: World, _: ServerState) {
	for (const [id, speech] of world.queryChanged(Speech)) {
		if (!speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!speech.new.specialType) {
				body.DialogGui.DialogFrame.DialogText.Text = speech.new.text!;
				body.DialogGui.DialogFrame.Visible = true;
				body.DialogGui.Progress.Visible = false;
				continue;
			} else if (speech.new.specialType.type === "meter") {
				body.DialogGui.Progress.Visible = true;
				const radial = new radialObject(body.DialogGui.Progress);
				const { time } = speech.new.specialType;
				task.spawn(() => {
					radial.tweenProgress(100, time, () => {
						if (world.contains(id)) world.remove(id, Speech);
					});
				});
			}
		}
		if (speech.old && !speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!world.contains(id)) return;
			body.DialogGui.DialogFrame.DialogText.Text = "";
			body.DialogGui.DialogFrame.Visible = false;
			body.DialogGui.Progress.Visible = false;
		}
		if (speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!speech.old.specialType) {
				body.DialogGui.DialogFrame.DialogText.Text = speech.new.text!;
			}
		}
	}
}

export = misc;
