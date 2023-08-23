import { getNextLevelCost, updateUtilityInfo } from "client/methods";
import { Balance, OpenStatus, Utility } from "shared/components";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
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
			const nextLevelCost = getNextLevelCost(world, id);
			const balance = getOrError(
				world,
				state.playerId!,
				Balance,
				"Player {@ID} does not have a Balance component",
			);
			utilityInfo.Background.Upgrade.BackgroundColor3 =
				balance.balance >= nextLevelCost ? Color3.fromRGB(76, 229, 11) : Color3.fromRGB(229, 20, 5);
			updateUtilityInfo(utilityInfo, utility.new, world, id);
		}
	}
	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new) {
			if (id === state.playerId) {
				const utilityInfo = player
					.FindFirstChildOfClass("PlayerGui")!
					.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
				const utility = state.utilityUpgrade;
				if (!utility || !utilityInfo.Enabled || utilityInfo.Adornee?.Name !== utility.component.type) continue;
				const nextLevelCost = getNextLevelCost(world, utility.componentId);
				utilityInfo.Background.Upgrade.BackgroundColor3 =
					balance.new.balance >= nextLevelCost ? Color3.fromRGB(76, 229, 11) : Color3.fromRGB(229, 20, 5);
			}
		}
	}
}

export = state;
