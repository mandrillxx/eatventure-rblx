import { component } from "@rbxts/matter";

export const UIHoverAnim = component<{
	animType: "Scale" | "Rotate" | "ScaleAndRotate";
	uiElement: GuiObject;
	undo: Callback;
}>("UIHoverAnim");
export type UIHoverAnim = ReturnType<typeof UIHoverAnim>;
