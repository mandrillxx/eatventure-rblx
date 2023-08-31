import { IRoactStoryWithControls } from "client/flipbook";
import { withHookDetection } from "@rbxts/roact-hooked";
import Button from "client/components/button";
import Roact from "@rbxts/roact";

Roact.setGlobalConfig({
	elementTracing: true,
	internalTypeChecks: true,
	propValidation: true,
	typeChecks: true,
});

interface IControls {
	useBoldFont: boolean;
}

withHookDetection(Roact);
const story: IRoactStoryWithControls<IControls> = {
	controls: {
		useBoldFont: false,
	},

	name: "Button.story",
	roact: Roact,
	story: ({ controls }) => {
		const { useBoldFont } = controls;
		return <Button Text="Hello world" onActivated={() => print("Activated!")} Bold={useBoldFont} />;
	},
	summary: "The button component.",
};

export = story;
