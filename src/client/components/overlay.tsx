import { ModalProps, UIButton, UIFrame, UIIButton, UIList, UIModal, UIPadding, UIText, UITextBox } from "./ui";
import { RunService } from "@rbxts/services";
import Roact, { useState } from "@rbxts/roact";

function Gamepasses({ Visible, Closed }: ModalProps) {
	return (
		<UIModal Title="Gamepasses" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(43, 43, 43)} />
	);
}

function DevProducts({ Visible, Closed }: ModalProps) {
	return (
		<UIModal
			Title="Dev Products"
			Visible={Visible}
			Closed={Closed}
			BackgroundColor3={Color3.fromRGB(12, 143, 43)}
		/>
	);
}

function Settings({ Visible, Closed }: ModalProps) {
	return <UIModal Title="Settings" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(26, 115, 5)} />;
}

function Codes({ Visible, Closed }: ModalProps) {
	const [code, setCode] = useState("");

	const SubmitCode = () => {
		if (RunService.IsRunning()) {
			// task.spawn(() => {
			// 	const status = Network.testFunction.client.invoke(code).expect();
			// 	print(status);
			// });
		}
	};

	return (
		<UIModal Title="Codes" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(66, 66, 66)}>
			<UIFrame Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1}>
				<UIPadding left={0.01} right={0.01} top={0.01} bottom={0.01} />
				<UIText
					Size={UDim2.fromScale(0.75, 0.4)}
					Position={UDim2.fromScale(0.5, 0.3)}
					TextWrapped={true}
					TextScaled={true}
					Text="Join our group or follow us on Twitter @sunbear_studio to get access to exclusive codes & game updates!"
				/>
				<UITextBox
					BackgroundColor3={Color3.fromRGB(43, 43, 43)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Size={UDim2.fromScale(0.4, 0.15)}
					PlaceholderText="Enter Code"
					TextScaled={true}
					Position={UDim2.fromScale(0.5, 0.65)}
					Changed={(newText) => setCode(newText)}
				/>
				<UIButton
					Text="Submit"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={Enum.Font.Gotham}
					BackgroundColor3={Color3.fromRGB(0, 176, 77)}
					Position={UDim2.fromScale(0.5, 0.85)}
					Size={UDim2.fromScale(0.5, 0.15)}
					Clicked={SubmitCode}
					Animate={true}
				/>
			</UIFrame>
		</UIModal>
	);
}

interface IButton {
	Clicked: (rbx: ImageButton) => void;
}

interface UIButtonProps extends IButton {
	Image: string;
}

function UISideButton({ Clicked, Image }: UIButtonProps) {
	return (
		<UIIButton
			Animate={true}
			BackgroundColor3={Color3.fromRGB(8, 160, 160)}
			Position={UDim2.fromScale()}
			Size={UDim2.fromScale(1, 1)}
			Image={Image}
			Clicked={Clicked}
		>
			<UIPadding top={0.1} bottom={0.1} />
		</UIIButton>
	);
}

function OpenSettings({ Clicked }: IButton) {
	return <UISideButton Clicked={Clicked} Image="rbxassetid://14567395815" />;
}

function OpenGamepasses({ Clicked }: IButton) {
	return <UISideButton Clicked={Clicked} Image="rbxassetid://14585356466" />;
}

function OpenDevProducts({ Clicked }: IButton) {
	return <UISideButton Clicked={Clicked} Image="rbxassetid://14567386315" />;
}

type Modal = "settings" | "gamepasses" | "devproducts" | "codes" | "upgrades" | undefined;

function UIOverlay() {
	const [openModal, setOpenModal] = useState<Modal>("codes");

	return (
		<UIFrame BackgroundTransparency={0.75} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)}>
			<UIPadding left={0.01} right={0.01} top={0.01} bottom={0.01} />
			<Gamepasses Visible={openModal === "gamepasses"} Closed={() => setOpenModal(undefined)} />
			<DevProducts Visible={openModal === "devproducts"} Closed={() => setOpenModal(undefined)} />
			<Settings Visible={openModal === "settings"} Closed={() => setOpenModal(undefined)} />
			<Codes Visible={openModal === "codes"} Closed={() => setOpenModal(undefined)} />
			<UIFrame Size={UDim2.fromScale(0.1, 0.5)} Position={UDim2.fromScale(0.05, 0.5)} BackgroundTransparency={1}>
				<UIList FillDirection={Enum.FillDirection.Vertical} />
				<OpenDevProducts
					Clicked={() => setOpenModal(openModal === "devproducts" ? undefined : "devproducts")}
				/>
				<OpenGamepasses Clicked={() => setOpenModal(openModal === "gamepasses" ? undefined : "gamepasses")} />
				<OpenSettings Clicked={() => setOpenModal(openModal === "settings" ? undefined : "settings")} />
			</UIFrame>
		</UIFrame>
	);
}

export = UIOverlay;
