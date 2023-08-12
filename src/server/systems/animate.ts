import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Animate, Body, NPC } from "shared/components";

function animate(world: World) {
	for (const [id, animate] of world.queryChanged(Animate)) {
		const body = world.get(id, Body);
		if (!body) continue;
		if (animate.old && !animate.new) {
			Log.Debug("Stopping animation for {@id}", id);
			for (const animation of body.model.Humanoid.GetPlayingAnimationTracks()) {
				animation.Stop();
			}
			continue;
		}
		if (!animate.old && animate.new) {
			Log.Debug("Starting animation for {@id}", id);
			body.model.Animate!.PlayEmote.Invoke(animate.new.animationType);
			task.delay(5, () => {
				world.remove(id, Animate);
			});
		}
	}
}

export = animate;
