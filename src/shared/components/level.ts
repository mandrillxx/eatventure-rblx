import { component } from "@rbxts/matter";
import { NPC, Product } from ".";

export const Level = component<{
	name: keyof Levels;
	npcs: NPC[];
	products: Product[];
}>("Level");
export type Level = ReturnType<typeof Level>;
