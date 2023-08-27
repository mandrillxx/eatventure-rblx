import { Body, Renderable, SoundEffect, Speech, Wants } from "shared/components";
import { ReplicatedStorage } from "@rbxts/services";
import { AssetMap, Foods } from "shared/globals";
import { radialObject } from "shared/radial";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { World } from "@rbxts/matter";
import Log from "@rbxts/log";

function misc(world: World, state: ServerState) {
	for (const [id, sound] of world.queryChanged(SoundEffect)) {
		const playSound = (sound: SoundEffect) => {
			if (!world.contains(id)) return;
			const soundInstance = ReplicatedStorage.Assets.Sounds.FindFirstChild(sound.sound) as Sound;
			if (!soundInstance) {
				if (state.debug) Log.Warn("Sound {@Sound} does not exist", sound.sound);
				world.despawn(id);
				return;
			}
			const soundModel = getOrError(world, id, Renderable, "Sound component was added to unrenderable entity");
			const soundInstanceClone = soundInstance.Clone();
			soundInstanceClone.Parent = soundModel.model;
			soundInstanceClone.Play();
			soundInstanceClone.Ended.Connect(() => {
				soundInstanceClone.Destroy();
				world.remove(id, SoundEffect);
			});
		};
		if (sound.old && sound.new && sound.new.meantFor === "everyone") {
			playSound(sound.new);
			continue;
		}
		if (!sound.old && sound.new && sound.new.meantFor === "everyone") {
			playSound(sound.new);
			continue;
		}
	}

	for (const [id, speech] of world.queryChanged(Speech)) {
		if (!speech.old && speech.new) {
			if (!world.contains(id)) continue;
			const body = getOrError(world, id, Body, "NPC does not have Body component but has Speech component");
			const bodyModel = body.model as BaseNPC;
			if (!speech.new.specialType) {
				const wants = getOrError(
					world,
					id,
					Wants,
					"NPC does not have Wants component but has Speech component",
				);
				const productName = wants.product.product.lower() as Foods;
				if (state.verbose)
					Log.Info(
						"NPC wants {@Product} {@AssetMapSize} {@AssetMap}",
						wants.product.product,
						AssetMap.size(),
						AssetMap.get(productName),
					);
				bodyModel.DialogGui.DialogFrame.ImageLabel.Image = AssetMap.get(productName)!;
				bodyModel.DialogGui.DialogFrame.DialogText.Text = speech.new.text!;
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
