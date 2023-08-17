import { StandardStatisticUpdateFunctions } from "@rbxts/player-statistics";
import { StatisticDescription } from "@rbxts/player-statistics/out/types/StatisticDescription";

export const PlayerStatisticsDefinition = {
	customersServed: identity<StatisticDescription>({
		defaultValue: 0,
		updateFunction: StandardStatisticUpdateFunctions.increment,
	}),
};

export const PlayerStatisticEventsDefinition = {
	customersServed: identity<ReadonlyArray<typeof PlayerStatisticsDefinition>>([
		{
			customersServed: PlayerStatisticsDefinition.customersServed,
		},
	]),
};
