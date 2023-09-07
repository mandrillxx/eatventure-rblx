import { ModalContextProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function Rewards({ Visible, Closed }: ModalContextProps) {
	return (
		<UIModal Title="Rewards" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(51, 219, 168)} />
	);
}
