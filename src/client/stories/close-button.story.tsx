import { IRoactStoryWithControls } from "client/flipbook";
import { withHookDetection } from "@rbxts/roact-hooked";
import * as ReactRoblox from "@rbxts/react-roblox";
import CloseButton from "client/components/close-button";
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
	name: "CloseButton.story",
	roact: Roact,
	story: ({ controls }) => {
		return <CloseButton onActivated={() => print("Closing")} />;
	},
	summary: "The button component.",
};

export = story;
