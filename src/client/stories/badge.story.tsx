import { IRoactStoryWithControls } from "client/flipbook";
import { withHookDetection } from "@rbxts/roact-hooked";
import * as ReactRoblox from "@rbxts/react-roblox";
import Badge from "client/components/badge";
import Roact from "@rbxts/roact";

Roact.setGlobalConfig({
	elementTracing: true,
	internalTypeChecks: true,
	propValidation: true,
	typeChecks: true,
});

interface IControls {
	labelText: string;
	buttonType: "Default" | "Destructive" | "Secondary" | "Success";
	badgeTextSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}

withHookDetection(Roact);
const story: IRoactStoryWithControls<IControls> = {
	controls: {
		labelText: "Hello world",
		badgeTextSize: "sm",
		buttonType: "Default",
	},
	reactRoblox: ReactRoblox,
	name: "Badge.story",
	roact: Roact,
	story: ({ controls }) => {
		const { labelText, buttonType, badgeTextSize } = controls;
		return <Badge Type={buttonType} TextSize={badgeTextSize} Text={labelText} />;
	},
	summary: "The badge component.",
};

export = story;
