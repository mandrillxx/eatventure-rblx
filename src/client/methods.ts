import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Utility } from "shared/components";

export function getNextLevelCost(world: World, id: AnyEntity, utility?: Utility) {
	const newUtility = utility ?? getOrError(world, id, Utility, "Utility no longer exists");
	const { baseUpgradeCost, xpLevel } = newUtility;
	const xpBias = xpLevel > 100 ? 1.205 : 1.2;
	const nextLevelCost = baseUpgradeCost * (xpBias ** xpLevel - 1);
	return nextLevelCost;
}

export function ServerEntityIdToClient(state: ClientState, id: AnyEntity) {
	return state.entityIdMap.get(tostring(id));
}

export function ClientEntityIdToServer(state: ClientState, id: AnyEntity) {
	for (const [key, value] of state.entityIdMap) {
		if (value === id) return key as unknown as AnyEntity;
	}
}

export function updateUtilityInfo(instance: UtilityInfoInstance, utility: Utility, world: World, utilityId: AnyEntity) {
	let rewardMultiplier = 1;
	if (utility.xpLevel >= 25 && utility.xpLevel < 50) rewardMultiplier = 1.125;
	if (utility.xpLevel >= 50 && utility.xpLevel < 100) rewardMultiplier = 1.135;
	if (utility.xpLevel >= 100 && utility.xpLevel < 250) rewardMultiplier = 1.145;
	if (utility.xpLevel >= 250) rewardMultiplier = 1.155;
	const xpBias = utility.xpLevel > 100 ? 1.205 : 1.2;
	const reward = FormatCompact(utility.reward * (xpBias ** utility.xpLevel - 1) * 5 * 0.2 * rewardMultiplier, 1);
	const nextLevelCost = FormatCompact(getNextLevelCost(world, utilityId), 2);
	instance.Background.Level.Text = `Level ${utility.xpLevel}`;
	instance.Background.Type.Text = tostring(utility.type);
	instance.Background.Reward.Text = `$${reward}`;
	instance.Background.Every.Text = `${utility.every}s`;
	instance.Background.Min.Text = tostring(utility.xpLevel);
	const nextLevel =
		utility.xpLevel >= 250
			? 250
			: utility.xpLevel >= 100
			? 250
			: utility.xpLevel >= 50
			? 100
			: utility.xpLevel >= 25
			? 50
			: 25;
	instance.Background.Max.Text =
		utility.xpLevel >= 250
			? "MAX"
			: utility.xpLevel >= 100
			? "250"
			: utility.xpLevel >= 50
			? "100"
			: utility.xpLevel >= 25
			? "50"
			: "25";
	instance.Background.Upgrade.Text = `Upgrade (${utility.xpLevel < 250 ? "$" + nextLevelCost : "MAX"})`;
	if (utility.xpLevel >= 250) instance.Background.Upgrade.BackgroundColor3 = Color3.fromRGB(229, 20, 5);
	const difference = nextLevel - utility.xpLevel;
	const progress = nextLevel <= 25 ? utility.xpLevel / nextLevel : (utility.xpLevel - difference) / nextLevel;
	instance.Background.Progress.Unlocked.Size = new UDim2(math.max(0, math.min(1, progress)), 0, 1, 0);
}
