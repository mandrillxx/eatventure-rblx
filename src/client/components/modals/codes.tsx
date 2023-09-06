import { ModalProps, UIButton, UIFrame, UIModal, UIPadding, UIText, UITextBox } from "../ui";
import Roact, { useState } from "@rbxts/roact";

export function Codes({ Visible, Closed }: ModalProps) {
	const [code, setCode] = useState("");

	const SubmitCode = () => {
		// task.spawn(() => {
		// 	const status = Network.testFunction.client.invoke(code).expect();
		// 	print(status);
		// });
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
