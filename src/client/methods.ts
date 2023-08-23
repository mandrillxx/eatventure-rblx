import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { getOrError } from "shared/util";
import { Utility } from "shared/components";

function getNextLevelCost(world: World, id: AnyEntity) {
	const newUtility = getOrError(world, id, Utility, "Utility no longer exists");
	const { baseUpgradeCost, upgradeMulti, xpLevel } = newUtility;
	const nextLevelCost = baseUpgradeCost * upgradeMulti ** xpLevel;
	return nextLevelCost;
}

export function updateUtilityInfo(instance: UtilityInfoInstance, utility: Utility, world: World, id: AnyEntity) {
	const reward = FormatCompact(utility.reward * utility.upgradeMulti ** utility.xpLevel, 1);
	const nextLevelCost = FormatCompact(getNextLevelCost(world, id), 2);

	instance.Background.Level.Text = `Level ${utility.xpLevel}`;
	instance.Background.Type.Text = tostring(utility.type);
	instance.Background.Reward.Text = `$${reward}`;
	instance.Background.Every.Text = `${utility.every}s`;
	instance.Background.Min.Text = tostring(utility.xpLevel);
	instance.Background.Max.Text = tostring(utility.xpLevel + 15);
	instance.Background.Upgrade.Text = `Upgrade ($${nextLevelCost})`;
	instance.Background.Progress.Unlocked.Size = new UDim2(utility.xpLevel / (utility.xpLevel + 15), 0, 1, 0);
}
