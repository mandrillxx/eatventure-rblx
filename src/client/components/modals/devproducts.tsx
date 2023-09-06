import { ModalProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function DevProducts({ Visible, Closed }: ModalProps) {
	return (
		<UIModal Title="DevProducts" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(12, 143, 43)} />
	);
}
