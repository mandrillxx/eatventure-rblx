import { component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";

// Components that should be replicated on both the server and client

export const Client = component<{
	player: Player;
	document: {
		coinMultiplier: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Level = component<{
	name: keyof Levels;
}>("Level");
export type Level = ReturnType<typeof Level>;

export const OwnedBy = component<{
	player: Player;
}>("OwnedBy");
export type OwnedBy = ReturnType<typeof OwnedBy>;

export const Body = component<{ model: CharacterRigR15 }>();
export type Body = ReturnType<typeof Body>;

export const BelongsTo = component<{
	level: Level;
}>("BelongsTo");
export type BelongsTo = ReturnType<typeof BelongsTo>;

export const NPC = component<{
	name: NPCNames;
}>("NPC");
export type NPC = ReturnType<typeof NPC>;

export const Pathfind = component<{
	destination: Vector3 | undefined;
	running: boolean;
}>("Pathfind");
export type Pathfind = ReturnType<typeof Pathfind>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;
