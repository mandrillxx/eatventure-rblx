import { ComponentInfo } from "shared/util";
import { component } from "@rbxts/matter";
import { Foods } from "shared/globals";
import { Level } from ".";

export const Product = component<{
	amount: number;
	product: Foods;
}>("Product");
export type Product = ReturnType<typeof Product>;

export const Utility = component<{
	type: string;
	machineName: string;
	unlocked: boolean;
	unlockCost: number;
	level: ComponentInfo<typeof Level>;
	weight: number;
	xpLevel: number;
	baseUpgradeCost: number;
	makes: Product;
	every: number;
	orderDelay: number;
	reward: number;
}>("Utility");
export type Utility = ReturnType<typeof Utility>;

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

export const SoundEffect = component<{
	sound: keyof Sounds;
	meantFor: "everyone" | Player;
}>("SoundEffect");
export type SoundEffect = ReturnType<typeof SoundEffect>;
