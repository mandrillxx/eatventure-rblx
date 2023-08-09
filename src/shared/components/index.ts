import { component } from "@rbxts/matter";

export const Activated = component<{}>("Activated");
export type Activated = ReturnType<typeof Activated>;

export const Client = component<{
	player: Player;
	lineSight: Vector3;
	document: {
		rewardsMultiplier: number;
		bonusMultiplier?: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Zone = component<{ maxCapacity: number; population: number }>("Zone");
export type Zone = ReturnType<typeof Zone>;
