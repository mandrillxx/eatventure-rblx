import { IButton, UIFrame, UIList, UIPadding, UIRatio, UISideButton } from "./ui";
import { Codes, DevProducts, Settings, Gamepasses } from "./modals";
import Roact, { useState } from "@rbxts/roact";
import { Upgrades } from "./modals/upgrades";
import { Renovate } from "./modals/renovate";
import { Shop } from "./modals/shop";

interface ButtonProps {
	Clicked: () => void;
	Image: string;
	Name: string;
	Order?: number;
}

function Button({ Clicked, Image, Name, Order }: ButtonProps) {
	return <UISideButton key={Name} Clicked={Clicked} Image={Image} Order={Order} />;
}

type Modal = "settings" | "gamepasses" | "devproducts" | "codes" | "upgrades" | "renovate" | "shop" | undefined;

function UIOverlay() {
	const [openModal, setOpenModal] = useState<Modal>("gamepasses");

	return (
		<UIFrame BackgroundTransparency={0.75} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)}>
			<UIPadding left={0.01} right={0.01} top={0.01} bottom={0.01} />
			<Upgrades Visible={openModal === "upgrades"} Closed={() => setOpenModal(undefined)} />
			<Gamepasses Visible={openModal === "gamepasses"} Closed={() => setOpenModal(undefined)} />
			<DevProducts Visible={openModal === "devproducts"} Closed={() => setOpenModal(undefined)} />
			<Settings Visible={openModal === "settings"} Closed={() => setOpenModal(undefined)} />
			<Codes Visible={openModal === "codes"} Closed={() => setOpenModal(undefined)} />
			<Renovate Visible={openModal === "renovate"} Closed={() => setOpenModal(undefined)} />
			<Shop Visible={openModal === "shop"} Closed={() => setOpenModal(undefined)} />
			<UIFrame
				Size={UDim2.fromScale(0.085, 0.5)}
				Position={UDim2.fromScale(0.05, 0.5)}
				BackgroundTransparency={1}
			>
				<UIRatio multiplier={0.25} />
				<UIList FillDirection={Enum.FillDirection.Vertical} />
				<Button
					Order={1}
					Name="Shop"
					Image="rbxassetid://14567386315"
					Clicked={() => setOpenModal(openModal === "shop" ? undefined : "shop")}
				/>
				<Button
					Order={2}
					Name="Gamepasses"
					Image="rbxassetid://14585356466"
					Clicked={() => setOpenModal(openModal === "gamepasses" ? undefined : "gamepasses")}
				/>
				<Button
					Order={3}
					Name="Settings"
					Image="rbxassetid://14567395815"
					Clicked={() => setOpenModal(openModal === "settings" ? undefined : "settings")}
				/>
			</UIFrame>
			<UIFrame
				Size={UDim2.fromScale(0.3, 0.15)}
				Position={UDim2.fromScale(0.825, 0.9)}
				BackgroundTransparency={1}
			>
				<UIRatio />
				<UIList FillDirection={Enum.FillDirection.Horizontal} />
				<Button
					Name="Renovate"
					Image="rbxassetid://14583168073"
					Clicked={() => setOpenModal(openModal === "renovate" ? undefined : "renovate")}
				/>
				<Button
					Name="Upgrades"
					Image="rbxassetid://14567319471"
					Clicked={() => setOpenModal(openModal === "upgrades" ? undefined : "upgrades")}
				/>
			</UIFrame>
		</UIFrame>
	);
}

export = UIOverlay;
