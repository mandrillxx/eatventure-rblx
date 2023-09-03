import { IRoactStoryWithControls } from "client/flipbook";
import { withHookDetection } from "@rbxts/roact-hooked";
import UIOverlay from "client/components/overlay";
import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";

Roact.setGlobalConfig({
	elementTracing: true,
	internalTypeChecks: true,
	propValidation: true,
	typeChecks: true,
});

interface IControls {}

withHookDetection(Roact);
const story: IRoactStoryWithControls<IControls> = {
	controls: {},
	reactRoblox: ReactRoblox,
	name: "Overlay.story",
	roact: Roact,
	story: ({ controls }) => {
		return <UIOverlay />;
	},
	summary: "The entire main game overlay UI",
};

export = story;
