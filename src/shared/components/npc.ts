import { AnyEntity, component } from "@rbxts/matter";
import { NPCDisplayNames } from "shared/util";
import { Product } from ".";

export const NPC = component<{
	name: NPCDisplayNames;
	type: NPCType;
	gender: "Male" | "Female";
}>("NPC");
export type NPC = ReturnType<typeof NPC>;

export const Speech = component<{
	text?: string;
	specialType?: { type: "image" | "meter"; image?: string; value?: number; time?: number };
}>("Speech");
export type Speech = ReturnType<typeof Speech>;

export const Customer = component<{
	servedBy?: AnyEntity; // Employee
}>("Customer");
export type Customer = ReturnType<typeof Customer>;

export const Employee = component("Employee");
export type Employee = ReturnType<typeof Employee>;

export const Holding = component<{
	product: Product[];
}>("Holding");
export type Holding = ReturnType<typeof Holding>;

export const Serving = component<{
	serving: NPC;
	wants: Wants;
}>("Serving");
export type Serving = ReturnType<typeof Serving>;

export const Wants = component<{
	product: Product;
	display: boolean;
}>("Wants");
export type Wants = ReturnType<typeof Wants>;

export const Pathfind = component<{
	destination: Vector3;
	running: boolean;
	cf?: boolean;
	finished?: Callback;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;
