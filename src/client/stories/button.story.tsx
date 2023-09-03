import { IRoactStoryWithControls } from "client/flipbook";
import { withHookDetection } from "@rbxts/roact-hooked";
import * as ReactRoblox from "@rbxts/react-roblox";
import Button from "client/components/button";
import Roact from "@rbxts/roact";

Roact.setGlobalConfig({
	elementTracing: true,
	internalTypeChecks: true,
	propValidation: true,
	typeChecks: true,
});

interface IControls {
	labelText: string;
	leadingIcon?: string;
	showLeadingIcon?: boolean;
	trailingIcon?: string;
	showTrailingIcon?: boolean;
	buttonType: "Default" | "Destructive" | "Secondary" | "Ghost" | "Success";
	buttonTextSize: "sm" | "md" | "lg" | "xl" | "2xl";
	buttonSize: "sm" | "md" | "lg" | "icon";
	useBoldFont: boolean;
}

withHookDetection(Roact);
const story: IRoactStoryWithControls<IControls> = {
	controls: {
		labelText: "Hello world",
		buttonSize: "sm",
		buttonTextSize: "sm",
		buttonType: "Default",
		useBoldFont: false,
	},
	reactRoblox: ReactRoblox,
	name: "Button.story",
	roact: Roact,
	story: ({ controls }) => {
		const {
			labelText,
			leadingIcon,
			showLeadingIcon,
			trailingIcon,
			showTrailingIcon,
			useBoldFont,
			buttonSize,
			buttonTextSize,
			buttonType,
		} = controls;
		return (
			<Button
				Type={buttonType}
				Size={buttonSize}
				TextSize={buttonTextSize}
				Bold={useBoldFont}
				Text={labelText}
				LeadingIcon={showLeadingIcon ? leadingIcon : undefined}
				TrailingIcon={showTrailingIcon ? trailingIcon : undefined}
				onActivated={() => print("Activated!")}
			/>
		);
	},
	summary: "The button component.",
};

export = story;
