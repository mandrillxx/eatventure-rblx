import { component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Level } from "./level";

// Components that should be replicated on both the server and client

export const Client = component<{
	player: Player;
	document: {
		coinMultiplier: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Body = component<{ model: CharacterRigR15 }>();
export type Body = ReturnType<typeof Body>;

export const BelongsTo = component<{
	level: Level;
	client: Client;
}>("BelongsTo");
export type BelongsTo = ReturnType<typeof BelongsTo>;

export const NPC = component<{
	name: NPCNames;
}>("NPC");
export type NPC = ReturnType<typeof NPC>;

export const Product = component<{
	amount: number;
	product: keyof Products;
}>("Product");
export type Product = ReturnType<typeof Product>;

export const Wants = component<{
	product: Product;
}>("Wants");
export type Wants = ReturnType<typeof Wants>;

export const Pathfind = component<{
	destination: Vector3;
	running: boolean;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;
