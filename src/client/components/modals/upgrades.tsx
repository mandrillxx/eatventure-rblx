import { ModalProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function Upgrades({ Visible, Closed }: ModalProps) {
	return (
		<UIModal Title="Upgrades" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(5, 166, 196)} />
	);
}
