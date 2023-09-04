import { useSpring } from "@rbxts/rbx-react-spring";
import Roact, { Binding, useState } from "@rbxts/roact";

export type BaseProps<T extends GuiObject> = Partial<WritableInstanceProperties<T>> & {
	Position: UDim2;
	Size: UDim2;
};

export type ButtonProps<T extends GuiButton> = BaseProps<T> & {
	Clicked: (rbx: T) => void;
	Animate: boolean;
};

export function UIFrame(props: BaseProps<Frame>) {
	return <frame AnchorPoint={new Vector2(0.5, 0.5)} {...props} />;
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

export function UIButton(props: BaseProps<TextButton>) {
	return (
		<textbutton AnchorPoint={new Vector2(0.5, 0.5)} {...props}>
			<UIRound multiplier={1.5} />
			<UIRatio multiplier={0.75} />
		</textbutton>
	);
}

interface UIListProps {
	FillDirection: Enum.FillDirection;
}

export function UIList({ FillDirection }: UIListProps) {
	return (
		<uilistlayout
			FillDirection={FillDirection}
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
