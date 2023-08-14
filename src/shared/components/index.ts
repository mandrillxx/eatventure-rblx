import { World, component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { EmployeeType, CustomerType } from "shared/Types";
import { Level as LevelComponent } from "./level";

export const Client = component<{
	player: Player;
	currentLevel: WorldInfo;
	document: {
		rewardsMultiplier: number;
		bonusMultiplier?: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Animate = component<{
	playFor?: number;
	animationType: AnimationType;
}>("Animate");
export type Animate = ReturnType<typeof Animate>;

export const Pathfind = component<{
	destination: Vector3 | undefined;
	running: boolean;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;

export const NPC = component<{
	world: WorldInfo;
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

export const Body = component<{ model: CharacterRigR15 & { Animate?: Script & { PlayEmote: BindableFunction } } }>();
export type Body = ReturnType<typeof Body>;

export const Interactable = component<{}>("Interactable");
export type Interactable = ReturnType<typeof Interactable>;

export const Prompt = component<{ prompt: ProximityPrompt }>("Prompt");
export type Prompt = ReturnType<typeof Prompt>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;
