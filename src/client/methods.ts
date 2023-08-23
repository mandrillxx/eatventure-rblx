import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { getOrError } from "shared/util";
import { Utility } from "shared/components";

export function getNextLevelCost(world: World, id: AnyEntity) {
	const newUtility = getOrError(world, id, Utility, "Utility no longer exists");
	const { baseUpgradeCost, xpLevel } = newUtility;
	const nextLevelCost = baseUpgradeCost * (1.2 ** xpLevel - 1);
	return nextLevelCost;
}

export function updateUtilityInfo(instance: UtilityInfoInstance, utility: Utility, world: World, utilityId: AnyEntity) {
	const reward = FormatCompact(utility.reward * (1.2 ** utility.xpLevel - 1) * 5 * 0.2, 1);
	const nextLevelCost = FormatCompact(getNextLevelCost(world, utilityId), 2);

	instance.Background.Level.Text = `Level ${utility.xpLevel}`;
	instance.Background.Type.Text = tostring(utility.type);
	instance.Background.Reward.Text = `$${reward}`;
	instance.Background.Every.Text = `${utility.every}s`;
	instance.Background.Min.Text = tostring(utility.xpLevel);
	instance.Background.Max.Text = "75";
	instance.Background.Upgrade.Text = `Upgrade ($${nextLevelCost})`;
	instance.Background.Progress.Unlocked.Size = new UDim2(utility.xpLevel / 75, 0, 1, 0);
}
