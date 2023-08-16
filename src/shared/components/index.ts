import { component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";

export const Client = component<{
	player: Player;
	document: {
		coinMultiplier: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Balance = component<{
	balance: number;
}>("Balance");
export type Balance = ReturnType<typeof Balance>;

export const Body = component<{
	model: CharacterRigR15;
}>("Body");
export type Body = ReturnType<typeof Body>;

export const BelongsTo = component<{
	level: Level;
	client: Client;
}>("BelongsTo");
export type BelongsTo = ReturnType<typeof BelongsTo>;

export const Utility = component<{
	type: string; //"Oven" | "IceCreamMaker" | "Fryer" | "DrinkMaker";
	unlocked: boolean;
	makes: Product;
	every: number;
}>("Utility");
export type Utility = ReturnType<typeof Utility>;

export const NPC = component<{
	name: NPCNames;
	type: NPCType;
}>("NPC");
export type NPC = ReturnType<typeof NPC>;

export const Product = component<{
	amount: number;
	product: keyof Products;
}>("Product");
export type Product = ReturnType<typeof Product>;

export const Serving = component<{
	serving: NPC;
}>("Serving");
export type Serving = ReturnType<typeof Serving>;

export const Wants = component<{
	product: Product;
}>("Wants");
export type Wants = ReturnType<typeof Wants>;

export const Pathfind = component<{
	destination: Vector3;
	running: boolean;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;

export const Renderable = component<{
	model: Model;
	doNotDestroy?: boolean;
}>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{
	cf: CFrame;
	doNotReconcile?: boolean;
}>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Level = component<{
	name: keyof Levels;
	maxEmployees: number;
	maxCustomers: number;
	spawnRate: number;
}>("Level");
export type Level = ReturnType<typeof Level>;

export const OwnedBy = component<{
	player: Player;
}>("OwnedBy");
export type OwnedBy = ReturnType<typeof OwnedBy>;

export const OpenStatus = component<{
	open: boolean;
}>("OpenStatus");
export type OpenStatus = ReturnType<typeof OpenStatus>;
