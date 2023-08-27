import {
	StandardRewardsOpeningCoordinator,
	VirtualCurrencyRewardGranter,
	WeightedRewardsSelector,
} from "@rbxts/reward-containers";
import Log from "@rbxts/log";

type CurrencyType = "cash" | "gems";

const virtualCurrencyRewardGranter = VirtualCurrencyRewardGranter.create<CurrencyType>(
	async (rewardedPlayer, currencyType, amount) => {
		Log.Info("Rewarding player {@Player} with {@Amount} {@CurrencyType}", rewardedPlayer, amount, currencyType);
	},
);

const rewardGrantersByType = new Map([["VirtualCurrency", virtualCurrencyRewardGranter]]);

const rewardsSelector = WeightedRewardsSelector.create(
	1,
	[
		{
			reward: {
				type: "cash",
			},
			cost: 1000,
			canBeDuplicated: true,
			weight: 80,
		},
		{
			reward: {
				type: "gems",
			},
			cost: 10,
			canBeDuplicated: true,
			weight: 20,
		},
	],
	1,
);

export const rewardsOpeningCoordinator = () =>
	StandardRewardsOpeningCoordinator.create(rewardGrantersByType, rewardsSelector);
