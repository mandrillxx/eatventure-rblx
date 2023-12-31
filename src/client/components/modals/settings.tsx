import { ModalContextProps, UIModal } from "../ui";
import Roact from "@rbxts/roact";

export function Settings({ Visible, Closed }: ModalContextProps) {
	return <UIModal Title="Settings" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(26, 115, 5)} />;
}
