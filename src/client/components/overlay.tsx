import { Codes, DevProducts, Settings, Gamepasses, Upgrades, Shop, Rewards, Renovate } from "./modals";
import { ModalContextProps, OverlayButton, UIFrame, UIList, UIPadding, UIRatio } from "./ui";
import Roact, { Element, useContext } from "@rbxts/roact";
import { Modal, ModalContext } from "./context/modal";

const Modals: { modalName: Modal; modal: ({ Visible, Closed, setOpenModal }: ModalContextProps) => Element }[] = [
	{
		modalName: "upgrades",
		modal: Upgrades,
	},
	{
		modalName: "gamepasses",
		modal: Gamepasses,
	},
	{
		modalName: "devproducts",
		modal: DevProducts,
	},
	{
		modalName: "settings",
		modal: Settings,
	},
	{
		modalName: "codes",
		modal: Codes,
	},
	{
		modalName: "renovate",
		modal: Renovate,
	},
	{
		modalName: "shop",
		modal: Shop,
	},
	{
		modalName: "rewards",
		modal: Rewards,
	},
];

function UIOverlay({ setOpenModal }: { setOpenModal: (modal: Modal) => void }) {
	const openModal = useContext(ModalContext);

	function modal(modal: Modal) {
		setOpenModal(openModal === modal ? undefined : modal);
	}

	return (
		<UIFrame BackgroundTransparency={0.75} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)}>
			<UIPadding left={0.01} right={0.01} top={0.01} bottom={0.01} />
			{Modals.map((modal) => {
				return (
					<modal.modal
						key={modal.modalName}
						Visible={openModal === modal.modalName}
						setOpenModal={setOpenModal}
						Closed={() => setOpenModal(undefined)}
					/>
				);
			})}
			<UIFrame
				Size={UDim2.fromScale(0.085, 0.5)}
				Position={UDim2.fromScale(0.05, 0.5)}
				BackgroundTransparency={1}
			>
				<UIRatio multiplier={0.25} />
				<UIList FillDirection={Enum.FillDirection.Vertical} />
				<OverlayButton Name="Shop" Image="rbxassetid://14567386315" Clicked={() => modal("shop")} />
				<OverlayButton Name="Gamepasses" Image="rbxassetid://14585356466" Clicked={() => modal("gamepasses")} />
				<OverlayButton Name="Settings" Image="rbxassetid://14567395815" Clicked={() => modal("settings")} />
			</UIFrame>
			<UIFrame
				Size={UDim2.fromScale(0.3, 0.15)}
				Position={UDim2.fromScale(0.825, 0.9)}
				BackgroundTransparency={1}
			>
				<UIRatio />
				<UIList FillDirection={Enum.FillDirection.Horizontal} />
				<OverlayButton Name="Renovate" Image="rbxassetid://14583168073" Clicked={() => modal("renovate")} />
				<OverlayButton Name="Upgrades" Image="rbxassetid://14567319471" Clicked={() => modal("upgrades")} />
			</UIFrame>
		</UIFrame>
	);
}

export = UIOverlay;
