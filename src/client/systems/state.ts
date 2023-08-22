import { ClientState } from "shared/clientState";
import { OpenStatus } from "shared/components";
import { World } from "@rbxts/matter";

function state(world: World, state: ClientState) {
	for (const [_id, openStatus] of world.queryChanged(OpenStatus)) {
		if (openStatus.new) {
			state.update("open", openStatus.new.open);
		}
	}
}

export = state;
