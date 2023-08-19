import { AnyEntity, component } from "@rbxts/matter";
import { Utility } from ".";

export const Level = component<{
	name: keyof Levels;
	maxEmployees: number;
	maxCustomers: number;
	eventRate: number;
	workRate: number;
	employeePace: number;
	spawnRate: number;
	destinations: { destinationId: AnyEntity; destination: Destination }[];
	nextAvailableDestination: () => { destinationId: AnyEntity; destination: Destination } | undefined;
}>("Level");
export type Level = ReturnType<typeof Level>;

export const HasUtilities = component<{
	utilities: { utility: Utility; model: BaseUtility }[];
}>("HasUtilities");
export type HasUtilities = ReturnType<typeof HasUtilities>;

export const Destination = component<{
	destination: Vector3;
	instance: BasePart;
	occupiedBy?: AnyEntity;
	type: NPCType;
}>("Destination");
export type Destination = ReturnType<typeof Destination>;

export const OwnedBy = component<{
	player: Player;
}>("OwnedBy");
export type OwnedBy = ReturnType<typeof OwnedBy>;

export const OpenStatus = component<{
	open: boolean;
}>("OpenStatus");
export type OpenStatus = ReturnType<typeof OpenStatus>;
