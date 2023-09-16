import {
	StandardRewardsOpeningCoordinator,
	VirtualCurrencyRewardGranter,
	WeightedRewardsSelector,
} from "@rbxts/reward-containers";
import { Provider } from "@rbxts/proton";
import Log from "@rbxts/log";

type CurrencyType = "cash" | "gems";

@Provider()
export class RewardProvider {
	coordinator: StandardRewardsOpeningCoordinator;

	virtualCurrencyRewardGranter = VirtualCurrencyRewardGranter.create<CurrencyType>(
		(rewardedPlayer, currencyType, amount) => this.awardCurrencyToPlayerAsync(rewardedPlayer, currencyType, amount),
	);
	rewardGrantersByType = new Map([["VirtualCurrency", this.virtualCurrencyRewardGranter]]);

	rewardSelector = WeightedRewardsSelector.create(
		1,
		[
			{
				reward: {
					type: "coins",
				},
				cost: 1000,
				weight: 80,
			},
			{
				reward: {
					type: "gems",
				},
				cost: 10,
				weight: 80,
			},
		],
		1,
	);

	constructor() {
		this.coordinator = StandardRewardsOpeningCoordinator.create(this.rewardGrantersByType, this.rewardSelector);
	}

	private awardCurrencyToPlayerAsync(rewardedPlayer: Player, currencyType: string, amount: number): Promise<void> {
		return Promise.resolve(
			Log.Info("Rewarding player {@Player} with {@Amount} {@CurrencyType}", rewardedPlayer, amount, currencyType),
		);
	}
}
