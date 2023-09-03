import { Storybook } from "./flipbook";
import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";

declare const script: { Parent: { stories: Folder } };

const OverlayStorybook: Storybook = {
	name: "Overlay",
	react: Roact,
	reactRoblox: ReactRoblox,
	storyRoots: [script.Parent.stories],
};

export = OverlayStorybook;
