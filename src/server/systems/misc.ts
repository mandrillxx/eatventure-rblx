import { radialObject } from "shared/radial";
import { Body, Speech } from "shared/components";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { World } from "@rbxts/matter";
import Log from "@rbxts/log";

function misc(world: World, _: ServerState) {
	for (const [id, speech] of world.queryChanged(Speech)) {
		if (!speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = getOrError(world, id, Body, "NPC does not have Body component but has Speech component");
			const bodyModel = body.model as BaseNPC;
			if (!speech.new.specialType) {
				bodyModel.DialogGui.DialogFrame.DialogText.Text = speech.new.text!;
				bodyModel.DialogGui.DialogFrame.Visible = true;
				bodyModel.DialogGui.Progress.Visible = false;
				continue;
			} else if (speech.new.specialType.type === "meter") {
				bodyModel.DialogGui.Progress.Visible = true;
				const radial = new radialObject(bodyModel.DialogGui.Progress);
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
			const body = getOrError(world, id, Body, "NPC does not have Body component but has Speech component");
			const bodyModel = body.model as BaseNPC;
			bodyModel.DialogGui.DialogFrame.DialogText.Text = "";
			bodyModel.DialogGui.DialogFrame.Visible = false;
			bodyModel.DialogGui.Progress.Visible = false;
		}
		if (speech.old && speech.new) {
			const body = getOrError(world, id, Body, "NPC does not have Body component but has Speech component");
			const bodyModel = body.model as BaseNPC;
			if (!speech.old.specialType) {
				bodyModel.DialogGui.DialogFrame.DialogText.Text = speech.new.text!;
			}
		}
	}
}

export = misc;
