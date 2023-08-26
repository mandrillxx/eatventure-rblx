import { AnyEntity, component } from "@rbxts/matter";
import { ComponentInfo } from "shared/util";
import { Utility } from ".";
import { UpgradeType } from "shared/upgrades";

export const Level = component<{
	name: keyof Levels;
	maxEmployees: number;
	maxCustomers: number;
	eventRate: number;
	workRate: number;
	employeePace: number;
	spawnRate: number;
	destinations: ComponentInfo<typeof Destination>[];
	nextAvailableDestination: () => ComponentInfo<typeof Destination> | undefined;
}>("Level");
export type Level = ReturnType<typeof Level>;

export const Upgrade = component<{
	identifier: number;
	type: UpgradeType;
	title: string;
	description: string;
	cost: number;
	purchased: boolean;
	upgrade: (levelId: AnyEntity) => void;
}>("Upgrade");
export type Upgrade = ReturnType<typeof Upgrade>;

export const HasUtilities = component<{
	utilities: { utility: Utility; model: BaseUtility }[];
}>("HasUtilities");
export type HasUtilities = ReturnType<typeof HasUtilities>;

export const Destination = component<{
	destination: Vector3;
	instance: BasePart;
	type: NPCType;
}>("Destination");
export type Destination = ReturnType<typeof Destination>;

export const OccupiedBy = component<{
	entityId: AnyEntity;
}>("OccupiedBy");
export type OccupiedBy = ReturnType<typeof OccupiedBy>;

export const OwnedBy = component<{
	player: Player;
	playerId: AnyEntity;
}>("OwnedBy");
export type OwnedBy = ReturnType<typeof OwnedBy>;

export const OpenStatus = component<{
	open: boolean;
}>("OpenStatus");
export type OpenStatus = ReturnType<typeof OpenStatus>;
