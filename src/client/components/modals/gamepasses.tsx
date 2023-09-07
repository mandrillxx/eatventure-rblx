import { ModalProps, UIFrame, UIIButton, UIModal, UIPadding, UIRatio, UIRound, UISFrame, UIText } from "../ui";
import { MarketplaceService, Players } from "@rbxts/services";
import { useProducts } from "../hooks/useProducts";
import { usePasses } from "../hooks/usePasses";
import Roact from "@rbxts/roact";

const player = Players.LocalPlayer;

interface IPurchaseButton {
	ID: number;
	Text: string;
	Image: string;
}

function PurchasableButton({ ID, Text, Image }: IPurchaseButton) {
	return (
		<UIFrame
			Size={UDim2.fromScale(0.3, 0.3)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(43, 73, 73)}
		>
			<UIPadding bottom={0.05} />
			<UIRatio multiplier={0.5} />
			<UIRound />
			<UIIButton
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.4)}
				Animate={true}
				Image={Image}
				BackgroundTransparency={1}
				Clicked={() => {
					MarketplaceService.PromptProductPurchase(player, ID);
				}}
			/>
			<UIText
				TextWrapped={true}
				TextSize={12}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(1, 0.5)}
				Text={Text}
			/>
		</UIFrame>
	);
}

export function Gamepasses({ Visible, Closed }: ModalProps) {
	const products = useProducts();
	const passes = usePasses();

	return (
		<UIModal Title="Robux Shop" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(43, 43, 43)}>
			<UISFrame
				Size={UDim2.fromScale(1, 0.75)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				CanvasSize={UDim2.fromScale(1, 1)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<UIPadding top={0.5} bottom={0.5} />
				<uigridlayout
					FillDirection={Enum.FillDirection.Horizontal}
					FillDirectionMaxCells={6}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				{products.map((product) => {
					return (
						<PurchasableButton
							ID={product.ProductId}
							Image={`rbxassetid://${product.IconImageAssetId}`}
							Text={product.Name}
						/>
					);
				})}
			</UISFrame>
		</UIModal>
	);
}
