import type { ReactStory } from "client/flipbook";
import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";

const OverlayStoryComponent = Roact.memo(() => {
	return <textbutton Text="Overlay" />;
});

const OverlayStory: ReactStory = {
	name: "OverlayStory.story",
	react: Roact,
	reactRoblox: ReactRoblox,
	story: <OverlayStoryComponent />,
	summary: `OverlayStory story.`,
};

export = OverlayStory;
