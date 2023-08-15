import { component } from "@rbxts/matter";

export const Level = component<{
	name: keyof Levels;
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
