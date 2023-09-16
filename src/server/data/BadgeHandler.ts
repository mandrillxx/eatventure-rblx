import { StatisticsDefinition, StatisticsSnapshot } from "@rbxts/player-statistics";
import { BadgeReward, ConstantRewardsSelector } from "@rbxts/reward-containers";
import { PlayerStatisticsDefinition } from "./PlayerStatisticsDefinition";
import { AchievementDescription } from "@rbxts/player-statistic-achievements";

export const served10Customers = identity<AchievementDescription<typeof PlayerStatisticsDefinition>>({
	getProgress: (statisticsSnapshot: StatisticsSnapshot<StatisticsDefinition>) =>
		statisticsSnapshot.customersServed >= 2 ? 1 : 0,
	relevantStatisticNames: ["customersServed"],
	rewardsSelector: ConstantRewardsSelector.create([
		identity<BadgeReward>({
			type: "Badge",
			badgeId: 2150865547,
		}),
	]),
});

export const served1000Customers = identity<AchievementDescription<typeof PlayerStatisticsDefinition>>({
	getProgress: (statisticsSnapshot: StatisticsSnapshot<StatisticsDefinition>) =>
		statisticsSnapshot.customersServed >= 1000 ? 1 : 0,
	relevantStatisticNames: ["customersServed"],
	rewardsSelector: ConstantRewardsSelector.create([
		identity<BadgeReward>({
			type: "Badge",
			badgeId: 2150865560,
		}),
	]),
});

export const earned100k = identity<AchievementDescription<typeof PlayerStatisticsDefinition>>({
	getProgress: (statisticsSnapshot: StatisticsSnapshot<StatisticsDefinition>) =>
		statisticsSnapshot.moneyEarned >= 100_000 ? 1 : 0,
	relevantStatisticNames: ["moneyEarned"],
	rewardsSelector: ConstantRewardsSelector.create([
		identity<BadgeReward>({
			type: "Badge",
			badgeId: 2150865576,
		}),
	]),
});

export const earned10m = identity<AchievementDescription<typeof PlayerStatisticsDefinition>>({
	getProgress: (statisticsSnapshot: StatisticsSnapshot<StatisticsDefinition>) =>
		statisticsSnapshot.moneyEarned >= 10_000_000 ? 1 : 0,
	relevantStatisticNames: ["moneyEarned"],
	rewardsSelector: ConstantRewardsSelector.create([
		identity<BadgeReward>({
			type: "Badge",
			badgeId: 2150865598,
		}),
	]),
});

export const maxedUtility = identity<AchievementDescription<typeof PlayerStatisticsDefinition>>({
	getProgress: (statisticsSnapshot: StatisticsSnapshot<StatisticsDefinition>) =>
		statisticsSnapshot.utilitiesMaxed >= 1 ? 1 : 0,
	relevantStatisticNames: ["utilitiesMaxed"],
	rewardsSelector: ConstantRewardsSelector.create([
		identity<BadgeReward>({
			type: "Badge",
			badgeId: 2150865585,
		}),
	]),
});

export const PlayerStatisticAchievementsDefinition = {
	served10Customers,
	served1000Customers,
	earned100k,
	earned10m,
	maxedUtility,
};
