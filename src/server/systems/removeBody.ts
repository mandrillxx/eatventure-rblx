import { World } from "@rbxts/matter";
import { Body } from "shared/components";

function removeBody(world: World) {
	for (const [_, bodyRecord] of world.queryChanged(Body)) {
		if (!bodyRecord.new) {
			if (bodyRecord.old && bodyRecord.old.model) {
				bodyRecord.old.model.Destroy();
			}
		}
	}
}

export = removeBody;
