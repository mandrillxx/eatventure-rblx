import { AnyEntity, component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Level } from ".";

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
	levelId: AnyEntity;
	client: Client;
}>("BelongsTo");
export type BelongsTo = ReturnType<typeof BelongsTo>;