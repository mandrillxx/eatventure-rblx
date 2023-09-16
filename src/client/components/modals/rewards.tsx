import { ModalContextProps, UIButton, UIFrame, UIModal, UIText } from "../ui";
import { useRewards } from "../hooks/useRewards";
import Roact from "@rbxts/roact";

export function Rewards({ Visible, Closed, setOpenModal }: ModalContextProps) {
	const { canOpen, claimReward } = useRewards();

	return (
		<UIModal Title="Rewards" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(51, 219, 168)}>
			<UIFrame Position={UDim2.fromScale(0.5, 0.5)} Size={UDim2.fromScale(1, 0.8)} BackgroundTransparency={1}>
				<UIText
					Size={UDim2.fromScale(0.75, 0.4)}
					Position={UDim2.fromScale(0.5, 0.4)}
					TextWrapped={true}
					TextColor3={Color3.fromRGB(255, 0, 13)}
					TextScaled={true}
					Text="Rewards can be claimed every 3 hours"
				/>

				<UIButton
					Position={UDim2.fromScale(0.5, 0.9)}
					Animate={true}
					Clicked={claimReward}
					Size={UDim2.fromScale(0.35, 0.15)}
					BackgroundColor3={canOpen ? Color3.fromRGB(48, 222, 10) : Color3.fromRGB(222, 48, 10)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text="Claim"
				/>
			</UIFrame>
		</UIModal>
	);
}
