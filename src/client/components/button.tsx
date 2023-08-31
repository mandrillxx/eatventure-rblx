import Roact from "@rbxts/roact";

interface ButtonProps {
	Text: string;
	Bold: boolean;
	onActivated: () => void;
}

function Button({ Text, onActivated, Bold }: ButtonProps) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundTransparency={1}
			ZIndex={1}
		>
			<textbutton
				Key="Button"
				Text={Text}
				Font={Bold ? Enum.Font.SourceSansBold : Enum.Font.SourceSans}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={Color3.fromRGB(97, 255, 61)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Event={{
					MouseButton1Click: () => {
						onActivated();
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
			</textbutton>
		</frame>
	);
}

export default Button;
