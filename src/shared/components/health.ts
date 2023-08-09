import { component } from "@rbxts/matter";

export const Health = component<{
	current: number;
	baseMax: number;
	maximum: number;

	lastChange: HealthChange;
	isDead: boolean;
}>("Health");
export type Health = ReturnType<typeof Health>;

export interface HealthChange {
	amount: number;
	time: number;
	crit: boolean;
}
