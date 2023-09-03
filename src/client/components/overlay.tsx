import { useSpring } from "@rbxts/roact-spring";
import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";

type BaseProps<T extends GuiObject> = Partial<WritableInstanceProperties<T>> & {
	Position: UDim2;
	Size: UDim2;
};

interface ModalProps {
	Visible: boolean;
}

function UIFrame(props: BaseProps<Frame>) {
	return <frame AnchorPoint={new Vector2(0.5, 0.5)} {...props} />;
}

function UIRatio({ multiplier = 1 }: { multiplier?: number }) {
	return <uiaspectratioconstraint AspectRatio={1.5 * multiplier} />;
}

function UIPadding({
	left = 0,
	right = 0,
	top = 0,
	bottom = 0,
}: {
	left?: 0;
	right?: 0;
	top?: number;
	bottom?: number;
}) {
	return (
		<uipadding
			PaddingLeft={new UDim(left, 0)}
			PaddingRight={new UDim(right, 0)}
			PaddingTop={new UDim(top, 0)}
			PaddingBottom={new UDim(bottom, 0)}
		/>
	);
}

function UIButton(props: BaseProps<TextButton>) {
	return (
		<textbutton AnchorPoint={new Vector2(0.5, 0.5)} {...props}>
			<UIRound multiplier={1.5} />
			<UIRatio multiplier={0.75} />
		</textbutton>
	);
}

function UIIButton(props: BaseProps<ImageButton> & { hover?: boolean }) {
	const [hovering, setHovering] = useState(false);

	const { position } = useSpring({
		position: hovering ? new UDim2(0.075, 0, 0.5, 0) : new UDim2(0.05, 0, 0.5, 0),
	});

	return (
		<imagelabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			{...props}
			Image=""
			Event={{
				MouseEnter: () => setHovering(true),
				MouseLeave: () => setHovering(false),
			}}
			ZIndex={1}
		>
			<UIRound multiplier={1.5} />
			<UIRatio multiplier={0.75} />
			<UIPadding top={0.1} bottom={0.1} />
			<imagebutton
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image={props.Image}
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				<UIRatio multiplier={0.75} />
			</imagebutton>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={0}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={0}
				Position={UDim2.fromScale(0.5, 0.4)}
			>
				<UIRound multiplier={1.5} />
			</imagelabel>
		</imagelabel>
	);
}

function UIRound({ multiplier = 1 }: { multiplier?: number }) {
	return <uicorner CornerRadius={new UDim(0.1 * multiplier, 0)} />;
}

/* START FRAMES */

function Codes({ Visible }: ModalProps) {
	return (
		<UIFrame
			BackgroundTransparency={0.5}
			BackgroundColor3={Color3.fromRGB(25, 177, 68)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.5, 0.5)}
			Visible={Visible}
		>
			<UIRound />
			<UIRatio />
		</UIFrame>
	);
}

/* END FRAMES */
/* START BUTTONS */

function OpenSettings() {
	return (
		<UIIButton
			BackgroundColor3={Color3.fromRGB(8, 160, 160)}
			Position={UDim2.fromScale(0.075, 0.5)}
			Size={UDim2.fromScale(0.12, 0.15)}
			Image="rbxassetid://14567395815"
			ScaleType={Enum.ScaleType.Fit}
		>
			<UIPadding top={0.1} bottom={0.1} />
		</UIIButton>
	);
}

/* START BUTTONS */

type Modal = "settings" | "gamepasses" | "devproducts" | "codes" | "upgrades" | undefined;

function UIOverlay() {
	const [openModal, setOpenModal] = useState<Modal>();

	return (
		<UIFrame BackgroundTransparency={0.75} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)}>
			<Codes Visible={openModal === "codes"} />
			<OpenSettings />
			<OpenSettings />
		</UIFrame>
	);
}

export = withHooks(UIOverlay);
