import { EventsDefinition, StandardStatisticUpdateFunctions, StatisticsDefinition } from "@rbxts/player-statistics";
import { StatisticDescription } from "@rbxts/player-statistics/out/types/StatisticDescription";

export const customersServed = identity<StatisticDescription>({
	defaultValue: 0,
	updateFunction: StandardStatisticUpdateFunctions.increment,
});

export const moneyEarned = identity<StatisticDescription>({
	defaultValue: 0,
	updateFunction: StandardStatisticUpdateFunctions.increment,
});

export const utilitiesMaxed = identity<StatisticDescription>({
	defaultValue: 0,
	updateFunction: StandardStatisticUpdateFunctions.increment,
});

export const PlayerStatisticsDefinition: StatisticsDefinition = {
	customersServed,
	moneyEarned,
	utilitiesMaxed,
};

export const PlayerStatisticEventsDefinition: EventsDefinition<typeof PlayerStatisticsDefinition> = {
	customersServed: identity<ReadonlyArray<keyof typeof PlayerStatisticsDefinition>>(["customersServed"]),
	moneyEarned: identity<ReadonlyArray<keyof typeof PlayerStatisticsDefinition>>(["moneyEarned"]),
	utilitiesMaxed: identity<ReadonlyArray<keyof typeof PlayerStatisticsDefinition>>(["utilitiesMaxed"]),
};
