import { ModalProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function Shop({ Visible, Closed }: ModalProps) {
	return (
		<UIModal
			Title="Your Restaurant"
			Visible={Visible}
			Closed={Closed}
			BackgroundColor3={Color3.fromRGB(120, 237, 48)}
		></UIModal>
	);
}
