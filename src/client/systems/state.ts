import { OpenStatus, Utility } from "shared/components";
import { updateUtilityInfo } from "client/methods";
import { ClientState } from "shared/clientState";
import { Players } from "@rbxts/services";
import { World } from "@rbxts/matter";

const player = Players.LocalPlayer;

function state(world: World, state: ClientState) {
	for (const [_id, openStatus] of world.queryChanged(OpenStatus)) {
		if (openStatus.new) {
			state.update("open", openStatus.new.open);
		}
	}
	for (const [id, utility] of world.queryChanged(Utility)) {
		if (utility.new) {
			const utilityInfo = player
				.FindFirstChildOfClass("PlayerGui")!
				.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
			if (!utilityInfo.Enabled || utilityInfo.Adornee?.Name !== utility.new.type) continue;
			updateUtilityInfo(utilityInfo, utility.new, world, id);
		}
	}
}

export = state;
