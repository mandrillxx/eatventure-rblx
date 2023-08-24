import { EventsDefinition, StandardStatisticUpdateFunctions, StatisticsDefinition } from "@rbxts/player-statistics";
import { StatisticDescription } from "@rbxts/player-statistics/out/types/StatisticDescription";

export const PlayerStatisticsDefinition: StatisticsDefinition = {
	customersServed: identity<StatisticDescription>({
		defaultValue: 0,
		updateFunction: StandardStatisticUpdateFunctions.increment,
	}),
	moneyEarned: identity<StatisticDescription>({
		defaultValue: 0,
		updateFunction: StandardStatisticUpdateFunctions.increment,
	}),
};

export const PlayerStatisticEventsDefinition: EventsDefinition<typeof PlayerStatisticsDefinition> = {
	customersServed: identity<ReadonlyArray<keyof typeof PlayerStatisticsDefinition>>(["customersServed"]),
	moneyEarned: identity<ReadonlyArray<keyof typeof PlayerStatisticsDefinition>>(["moneyEarned"]),
};
