import { useSpring } from "@rbxts/rbx-react-spring";
import Roact, { useState } from "@rbxts/roact";

export type BaseProps<T extends GuiObject> = Partial<WritableInstanceProperties<T>> & {
	Position: UDim2;
	Size: UDim2;
};

export type ButtonProps<T extends GuiButton> = BaseProps<T> & {
	Clicked: (rbx: T) => void;
	Animate: boolean;
};

export interface IButton {
	Clicked: (rbx: ImageButton) => void;
}

export interface UIButtonProps extends IButton {
	Image: string;
	Order?: number;
}

export interface ModalProps {
	Visible: boolean;
	Closed: () => void;
}

interface TextBoxProps extends BaseProps<TextBox> {
	Changed: (newText: string) => void;
}

type IModal = Roact.PropsWithChildren<
	ModalProps & {
		Title: string;
		BackgroundColor3: Color3;
	}
>;

type IText = Roact.PropsWithChildren<BaseProps<TextLabel>>;

interface UIListProps {
	FillDirection: Enum.FillDirection;
}

export function UISideButton({ Clicked, Image, Order }: UIButtonProps) {
	return (
		<UIIButton
			Animate={true}
			LayoutOrder={Order}
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

export function UIFrame(props: BaseProps<Frame>) {
	return <frame AnchorPoint={new Vector2(0.5, 0.5)} {...props} />;
}

export function UISFrame(props: BaseProps<ScrollingFrame>) {
	return <scrollingframe AnchorPoint={new Vector2(0.5, 0.5)} {...props} />;
}

export function UIRatio({ multiplier = 1 }: { multiplier?: number }) {
	return <uiaspectratioconstraint AspectRatio={1.5 * multiplier} />;
}

export function UIPadding({
	left = 0,
	right = 0,
	top = 0,
	bottom = 0,
}: {
	left?: number;
	right?: number;
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

export function UIButton(props: ButtonProps<TextButton>) {
	const newProps = table.clone(props);
	newProps.Clicked = undefined!;
	newProps.Animate = undefined!;

	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Event={{
				MouseButton1Click: props.Clicked,
			}}
			{...newProps}
		>
			<UIPadding left={0.1} right={0.1} top={0.05} bottom={0.05} />
			<uitextsizeconstraint MinTextSize={16} MaxTextSize={24} />
			<UIRound multiplier={1.5} />
		</textbutton>
	);
}

export function UIText(props: IText) {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Font={Enum.Font.Gotham}
			TextSize={48}
			{...props}
		>
			{props.children}
		</textlabel>
	);
}

export function UITextBox(props: TextBoxProps) {
	const newProps = table.clone(props);
	newProps.Changed = undefined!;

	return (
		<textbox
			AnchorPoint={new Vector2(0.5, 0.5)}
			Font={Enum.Font.Gotham}
			FontSize={"Size24"}
			Text=""
			ClearTextOnFocus={false}
			Event={{
				InputEnded: (rbx) => props.Changed(rbx.Text),
			}}
			{...newProps}
		>
			<UIRound multiplier={1.5} />
		</textbox>
	);
}

export function UIModal({ Title, Visible, BackgroundColor3, Closed, children }: IModal) {
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

	const [h, s, v] = BackgroundColor3.ToHSV();

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
			<UIText
				Size={UDim2.fromScale(0.5, 0.15)}
				Position={UDim2.fromScale(0.5, 0)}
				TextWrapped={true}
				TextScaled={true}
				Text={Title}
				BackgroundColor3={Color3.fromHSV(h, s, v - 0.1)}
				BackgroundTransparency={0.1}
			>
				<UIPadding top={0.1} bottom={0.1} left={0.15} right={0.15} />
				<UIRound multiplier={5} />
			</UIText>
			<UIIButton
				Animate={true}
				Image="rbxassetid://14567531239"
				Clicked={Closed}
				Position={UDim2.fromScale(0.97, 0.03)}
				Size={UDim2.fromScale(0.2, 0.2)}
				BackgroundTransparency={1}
			/>
			{children}
		</frame>
	);
}

export function UIList({ FillDirection }: UIListProps) {
	return (
		<uilistlayout
			FillDirection={FillDirection}
			SortOrder={Enum.SortOrder.LayoutOrder}
			VerticalAlignment={Enum.VerticalAlignment.Center}
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			Padding={new UDim(0.1, 0.1)}
		/>
	);
}

export function UIGrid({ FillDirection }: UIListProps) {
	return (
		<uigridlayout
			FillDirection={FillDirection}
			VerticalAlignment={Enum.VerticalAlignment.Center}
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			CellSize={UDim2.fromScale(1, 1)}
			CellPadding={UDim2.fromScale(0.1, 0.1)}
		/>
	);
}

export function UIIButton(props: ButtonProps<ImageButton>) {
	const [hovering, setHovering] = useState(false);
	const newProps = table.clone(props);
	newProps.Clicked = undefined!;
	newProps.Animate = undefined!;

	const { size } = useSpring(
		{
			config: {
				mass: 0.5,
			},
			size: hovering ? UDim2.fromScale(props.Size.X.Scale * 1.1, props.Size.Y.Scale * 1.1) : props.Size,
		},
		[hovering],
	);

	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			{...newProps}
			Image=""
			Event={{
				MouseEnter: () => setHovering(true),
				MouseLeave: () => setHovering(false),
				MouseButton1Click: props.Clicked,
			}}
			Size={props.Animate ? size : props.Size}
			ZIndex={1}
		>
			<UIRound multiplier={1.5} />
			<UIRatio multiplier={0.75} />
			<UIPadding top={0.1} bottom={0.1} />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Image={props.Image}
				ScaleType={Enum.ScaleType.Fit}
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				<UIRatio multiplier={0.75} />
			</imagelabel>
		</imagebutton>
	);
}

export function UIRound({ multiplier = 1 }: { multiplier?: number }) {
	return <uicorner CornerRadius={new UDim(0.1 * multiplier, 0)} />;
}
