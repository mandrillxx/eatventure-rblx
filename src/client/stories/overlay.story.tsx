import type { ReactStory } from "client/flipbook";
import * as ReactRoblox from "@rbxts/react-roblox";
import { App } from "client/components/app";
import Roact from "@rbxts/roact";

Roact.setGlobalConfig({
	elementTracing: true,
	internalTypeChecks: true,
	propValidation: true,
	typeChecks: true,
});

const OverlayStory: ReactStory = {
	name: "OverlayStory.story",
	react: Roact,
	reactRoblox: ReactRoblox,
	story: <App />,
	summary: `OverlayStory story.`,
};

export = OverlayStory;
