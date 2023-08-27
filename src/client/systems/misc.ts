import { Players, ReplicatedStorage } from "@rbxts/services";
import { SoundEffect } from "shared/components";
import { World } from "@rbxts/matter";
import Log from "@rbxts/log";

const player = Players.LocalPlayer;

function misc(world: World) {
	for (const [id, sound] of world.queryChanged(SoundEffect)) {
		if (!sound.new || sound.new.meantFor !== player) continue;
		const playSound = (sound: SoundEffect) => {
			if (!world.contains(id)) return;
			const soundInstance = ReplicatedStorage.Assets.Sounds.FindFirstChild(sound.sound) as Sound;
			if (!soundInstance) {
				Log.Warn("Sound {@Sound} does not exist", sound.sound);
				world.despawn(id);
				return;
			}
			const soundInstanceClone = soundInstance.Clone();
			soundInstanceClone.Parent = player.Character;
			soundInstanceClone.Play();
			soundInstanceClone.Ended.Connect(() => {
				soundInstanceClone.Destroy();
				world.remove(id, SoundEffect);
			});
		};
		if (sound.old && sound.new) {
			playSound(sound.new);
			continue;
		}
		if (!sound.old && sound.new) {
			playSound(sound.new);
			continue;
		}
	}
}

export = misc;
