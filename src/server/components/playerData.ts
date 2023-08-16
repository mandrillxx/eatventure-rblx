import { component } from "@rbxts/matter";

export const PlayerData = component<{
	balance: number;
	level: number;
	utilityLevels: Map<string, number>;
}>("PlayerData");
export type PlayerData = ReturnType<typeof PlayerData>;
