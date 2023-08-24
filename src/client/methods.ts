import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Utility } from "shared/components";

export function getNextLevelCost(world: World, id: AnyEntity, utility?: Utility) {
	const newUtility = utility ?? getOrError(world, id, Utility, "Utility no longer exists");
	const { baseUpgradeCost, xpLevel } = newUtility;
	const nextLevelCost = baseUpgradeCost * (1.2 ** xpLevel - 1);
	return nextLevelCost;
}

export function ServerEntityIdToClient(state: ClientState, id: AnyEntity) {
	return state.entityIdMap.get(tostring(id));
}

export function updateUtilityInfo(instance: UtilityInfoInstance, utility: Utility, world: World, utilityId: AnyEntity) {
	let rewardMultiplier = 1;
	if (utility.xpLevel >= 25 && utility.xpLevel < 50) rewardMultiplier *= 1.5;
	if (utility.xpLevel >= 50 && utility.xpLevel < 100) rewardMultiplier *= 2;
	if (utility.xpLevel >= 100) rewardMultiplier *= 3;
	const reward = FormatCompact(utility.reward * (1.2 ** utility.xpLevel - 1) * 5 * 0.2 * rewardMultiplier, 1);
	const nextLevelCost = FormatCompact(getNextLevelCost(world, utilityId), 2);
	instance.Background.Level.Text = `Level ${utility.xpLevel}`;
	instance.Background.Type.Text = tostring(utility.type);
	instance.Background.Reward.Text = `$${reward}`;
	instance.Background.Every.Text = `${utility.every}s`;
	instance.Background.Min.Text = tostring(utility.xpLevel);
	const nextLevel = utility.xpLevel >= 100 ? 100 : utility.xpLevel >= 50 ? 100 : utility.xpLevel >= 25 ? 50 : 25;
	instance.Background.Max.Text =
		utility.xpLevel >= 100 ? "MAX" : utility.xpLevel >= 50 ? "100" : utility.xpLevel >= 25 ? "50" : "25";
	instance.Background.Upgrade.Text = `Upgrade (${utility.xpLevel < 100 ? "$" + nextLevelCost : "MAX"})`;
	if (utility.xpLevel >= 100) instance.Background.Upgrade.BackgroundColor3 = Color3.fromRGB(229, 20, 5);
	instance.Background.Progress.Unlocked.Size = new UDim2(utility.xpLevel / nextLevel, 0, 1, 0);
}
