import { component } from "@rbxts/matter";
import { Level } from ".";

export const Product = component<{
	amount: number;
	product: keyof Products;
}>("Product");
export type Product = ReturnType<typeof Product>;

export const Utility = component<{
	type: string; //"Oven" | "IceCreamMaker" | "Fryer" | "DrinkMaker";
	unlocked: boolean;
	level: Level;
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
