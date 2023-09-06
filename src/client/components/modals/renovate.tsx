import { ModalProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function Renovate({ Visible, Closed }: ModalProps) {
	return (
		<UIModal Title="Renovate" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(214, 51, 219)} />
	);
}
