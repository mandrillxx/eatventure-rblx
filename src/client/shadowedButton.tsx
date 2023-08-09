import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";
import { JsxChild } from "@rbxts/roact/src/jsx";

interface Props {
	name?: string;
	icon?: JsxChild;
	cb?: Callback;
	shadowBg?: Color3;
	bg?: Color3;
	position?: UDim2;
	size?: UDim2;
	text?: string;
	textColor?: Color3;
	textSize?: number;
	font?: Enum.Font;
	anchorPoint?: Vector2;
}

function ShadowedButton({
	name,
	icon,
	cb,
	shadowBg,
	bg,
	position,
	size,
	text,
	textColor,
	textSize,
	font,
	anchorPoint,
}: Props): Roact.Element {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			<textbutton
				Key="Shadow"
				AnchorPoint={anchorPoint}
				AutoButtonColor={false}
				BackgroundTransparency={0}
				Font={font ?? Enum.Font.SourceSansBold}
				Position={position}
				Size={size}
				Text={""}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextSize={22}
				BackgroundColor3={shadowBg ?? Color3.fromRGB(66, 66, 66)}
			>
				<uicorner Key="Borders" CornerRadius={new UDim(0, 8)} />
				<textbutton
					BackgroundColor3={bg}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
					Size={new UDim2(1, 0, 1, -4)}
					Text={text ?? ""}
					TextSize={textSize}
					TextColor3={textColor}
					Event={{
						MouseButton1Click: cb,
					}}
				>
					<uicorner Key="Borders" CornerRadius={new UDim(0, 8)} />
					{icon}
				</textbutton>
			</textbutton>
		</frame>
	);
}

export default withHooks(ShadowedButton);
