import { ModalProps, UIFrame, UIIButton, UIList, UIModal, UIRatio } from "../ui";
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
		<UIIButton
			Size={UDim2.fromScale(0.3, 0.3)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Animate={true}
			Image={Image}
			BackgroundTransparency={1}
			Clicked={() => {
				MarketplaceService.PromptProductPurchase(player, ID);
			}}
		>
			<UIRatio />
		</UIIButton>
	);
}

export function Gamepasses({ Visible, Closed }: ModalProps) {
	const products = useProducts();
	const passes = usePasses();

	return (
		<UIModal Title="Gamepasses" Visible={Visible} Closed={Closed} BackgroundColor3={Color3.fromRGB(43, 43, 43)}>
			<UIFrame Size={UDim2.fromScale(1, 0.6)} Position={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1}>
				<uitablelayout
					FillDirection={Enum.FillDirection.Horizontal}
					MajorAxis={Enum.TableMajorAxis.RowMajor}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					FillEmptySpaceRows={false}
					FillEmptySpaceColumns={true}
				/>
				{products.map((product, index) => {
					return (
						<PurchasableButton
							ID={product.ProductId}
							Image={`rbxassetid://${product.IconImageAssetId}`}
							Text={product.Name}
						/>
					);
				})}
			</UIFrame>
		</UIModal>
	);
}
