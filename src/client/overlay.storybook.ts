import { IStorybook } from "./flipbook";
import Roact from "@rbxts/roact";

const OverlayStorybook: IStorybook = {
	name: "Overlay",
	roact: Roact,
	storyRoots: [script.Parent!.FindFirstChild("stories")!],
};

export = OverlayStorybook;
