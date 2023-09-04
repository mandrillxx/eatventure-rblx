import { useSpring } from "@rbxts/rbx-react-spring";
import { UIFrame, UIIButton, UIList, UIPadding, UIRatio, UIRound } from "./ui";
import Roact, { useEffect, useState } from "@rbxts/roact";

interface ModalProps {
	Visible: boolean;
	Closed: () => void;
}

interface IModal extends ModalProps {
	BackgroundColor3: Color3;
}

function BaseModal({ Visible, BackgroundColor3, Closed }: IModal) {
	const { position } = useSpring(
		{
			config: {
				mass: 1,
				friction: 20,
				tension: 150,
			},
			position: Visible ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.5, 1.5),
		},
		[Visible],
	);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={BackgroundColor3}
			Position={position}
			Size={UDim2.fromScale(0.5, 0.5)}
			Visible={Visible}
		>
			<UIRound />
			<UIRatio />
			<UIIButton
				Animate={true}
				Image="rbxassetid://14567531239"
				Clicked={Closed}
				Position={UDim2.fromScale(0.97, 0.03)}
				Size={UDim2.fromScale(0.2, 0.2)}
				BackgroundTransparency={1}
			/>
		</frame>
	);
}

function Gamepasses({ Visible, Closed }: ModalProps) {
	return <BaseModal Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(43, 43, 43)} />;
}

function DevProducts({ Visible, Closed }: ModalProps) {
	return <BaseModal Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(12, 143, 43)} />;
}

function Settings({ Visible, Closed }: ModalProps) {
	return <BaseModal Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(26, 115, 5)} />;
}

function Codes({ Visible, Closed }: ModalProps) {
	return <BaseModal Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(184, 13, 13)} />;
}

interface IButton {
	Clicked: (rbx: ImageButton) => void;
}

interface UIButtonProps extends IButton {
	Image: string;
}

function UIButton({ Clicked, Image }: UIButtonProps) {
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
	return <UIButton Clicked={Clicked} Image="rbxassetid://14567395815" />;
}

function OpenGamepasses({ Clicked }: IButton) {
	return <UIButton Clicked={Clicked} Image="rbxassetid://14585356466" />;
}

function OpenDevProducts({ Clicked }: IButton) {
	return <UIButton Clicked={Clicked} Image="rbxassetid://14567386315" />;
}

type Modal = "settings" | "gamepasses" | "devproducts" | "codes" | "upgrades" | undefined;

function UIOverlay() {
	const [openModal, setOpenModal] = useState<Modal>();

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
