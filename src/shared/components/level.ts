import { component } from "@rbxts/matter";

export const Level = component<{
	name: string;
}>("Level");
export type Level = ReturnType<typeof Level>;
