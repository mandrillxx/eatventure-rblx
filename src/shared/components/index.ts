import { component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { EmployeeType, CustomerType } from "shared/Types";

export const Client = component<{
	player: Player;
	currentLevel: Level | undefined;
	document: {
		rewardsMultiplier: number;
		bonusMultiplier?: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Animate = component<{
	animationScale: number;
}>("Animate");
export type Animate = ReturnType<typeof Animate>;

export const Pathfind = component<{
	destination: Vector3 | undefined;
	running: boolean;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;

export const NPC = component<{
	name: NPCNames;
}>("NPC");
export type NPC = ReturnType<typeof NPC>;

export const Product = component<{
	name: string;
}>("Product");
export type Product = ReturnType<typeof Product>;

export const Employee = component<{
	type: EmployeeType;
}>("Employee");
export type Employee = ReturnType<typeof Employee>;

export const Customer = component<{
	type: CustomerType;
}>("Customer");
export type Customer = ReturnType<typeof Customer>;

export const Body = component<{ model: CharacterRigR15 }>();
export type Body = ReturnType<typeof Body>;

export const Interactable = component<{}>("Interactable");
export type Interactable = ReturnType<typeof Interactable>;

export const Prompt = component<{ prompt: ProximityPrompt }>("Prompt");
export type Prompt = ReturnType<typeof Prompt>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Zone = component<{ maxCapacity: number; population: number }>("Zone");
export type Zone = ReturnType<typeof Zone>;
