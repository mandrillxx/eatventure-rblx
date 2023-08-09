import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";
import ShadowedButton from "./shadowedButton";

const player = Players.LocalPlayer;

function Money(): Roact.Element {
	const [menuOpened, setMenuState] = useState(false);

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} ZIndex={1}>
			<ShadowedButton
				name="Add"
				anchorPoint={new Vector2(0, 0.5)}
				icon={
					<textlabel
						Key="Title"
						AnchorPoint={new Vector2(0.5, 0)}
						BackgroundTransparency={1}
						Font={Enum.Font.SourceSansBold}
						Position={new UDim2(0.5, 0, 0, -2)}
						Size={UDim2.fromScale(1, 1)}
						Text="+"
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={44}
						TextStrokeTransparency={0}
						ZIndex={5}
					/>
				}
				cb={(): void => {
					if (menuOpened) {
						return;
					}
					setMenuState(true);
				}}
				bg={Color3.fromRGB(255, 255, 66)}
				shadowBg={Color3.fromRGB(66, 66, 66)}
				position={new UDim2(0, 210, 0.5, 0)}
				size={UDim2.fromOffset(44, 44)}
			/>

			<frame
				Key="Amount"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				Position={new UDim2(0, 10, 0.5, 0)}
				Size={new UDim2(0, 190, 0, 44)}
			>
				<imagelabel
					Key="Icon"
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Image="rbxassetid://2048193204"
					Position={new UDim2(0, 4, 0.5, 0)}
					Size={new UDim2(0.8, 0, 0.8, 0)}
					SizeConstraint={Enum.SizeConstraint.RelativeYY}
					ZIndex={2}
				/>
				<uicorner />
				<textlabel
					Key="Title"
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Font={Enum.Font.SourceSansBold}
					Position={new UDim2(0, 44, 0.5, 0)}
					Size={new UDim2(1, -50, 0, 30)}
					Text="0"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextSize={30}
					TextStrokeTransparency={0}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					ZIndex={5}
				/>
			</frame>

			<ShadowedButton
				name="Sell"
				size={UDim2.fromOffset(80, 44)}
				anchorPoint={new Vector2(0, 0.5)}
				icon={
					<textlabel
						TextSize={32}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.SourceSansBold}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Text={"SELL"}
						TextStrokeTransparency={0}
					/>
				}
				position={new UDim2(0, 10, 0.5, -52)}
				cb={(): void => {
					const character = player?.Character;

					if (character && player.IsDescendantOf(game)) {
						character.PivotTo(new CFrame().add(new Vector3(0, 4, 0)));
					}
				}}
				shadowBg={Color3.fromRGB(66, 66, 66)}
				bg={Color3.fromRGB(26, 206, 106)}
			/>

			<frame
				Key="Menu"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(0, 400, 0, 315)}
				Visible={menuOpened}
				ZIndex={4}
			>
				<frame
					Key="Prompt"
					BackgroundTransparency={1}
					Position={new UDim2(0, 0, 1, 10)}
					Size={new UDim2(1, 0, 0, 30)}
					Visible={false}
					ZIndex={2}
				>
					<textlabel
						Key="Label"
						BackgroundTransparency={1}
						Font={Enum.Font.SourceSansBold}
						Size={new UDim2(1, 0, 1, 0)}
						Text="Uh-oh, seems like you've run out of filmbux!"
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextSize={20}
						ZIndex={3}
					/>
				</frame>
				<uicorner />
				<ShadowedButton
					name="Close"
					bg={Color3.fromRGB(255, 23, 68)}
					size={UDim2.fromOffset(36, 36)}
					icon={
						<textlabel
							BackgroundTransparency={1}
							Font={Enum.Font.SourceSansBold}
							LayoutOrder={1}
							Size={new UDim2(0, 36, 0, 36)}
							Text={"X"}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextSize={28}
							ZIndex={5}
							TextStrokeTransparency={0}
						/>
					}
					anchorPoint={new Vector2(1, 0)}
					position={new UDim2(1, -10, 0, 10)}
					cb={(): void => {
						setMenuState(false);
					}}
				/>
				<frame
					Key="List"
					Size={new UDim2(0, 382, 1, 0)}
					BackgroundTransparency={1}
					Position={UDim2.fromOffset(10, 58)}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(10, 10)}
						CellSize={UDim2.fromOffset(120, 120)}
						FillDirection={Enum.FillDirection.Horizontal}
						FillDirectionMaxCells={3}
						SortOrder={Enum.SortOrder.LayoutOrder}
						StartCorner={Enum.StartCorner.TopLeft}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					/>
					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>

					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>

					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>

					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>

					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>

					<ShadowedButton
						icon={
							<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
								<textlabel
									Key="Title"
									Text="1,600"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextSize={34}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
								/>
								<textlabel
									Key="Cost"
									Text="19 R$"
									Size={new UDim2(1, 0, 0, 42)}
									BackgroundTransparency={1}
									TextColor3={Color3.fromRGB(0, 230, 118)}
									TextSize={22}
									Font={Enum.Font.SourceSansBold}
									TextStrokeTransparency={0}
									Position={new UDim2(0, 0, 1, -36)}
								/>
								<imagelabel
									Key="Img"
									AnchorPoint={new Vector2(0.5, 0)}
									BackgroundTransparency={1}
									Image="rbxassetid://1705905425"
									Position={new UDim2(0.5, 0, 0, 44)}
									Size={new UDim2(1, -70, 1, -70)}
									SizeConstraint={Enum.SizeConstraint.RelativeYY}
									ZIndex={5}
								/>
							</frame>
						}
						size={UDim2.fromScale(1, 1)}
						bg={Color3.fromRGB(3, 169, 244)}
					/>
				</frame>
				<textlabel
					Key="Title"
					Text="Buy Coins"
					Position={UDim2.fromOffset(15, 10)}
					Size={new UDim2(1, 0, 0, 36)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 0)}
					TextSize={26}
					TextStrokeTransparency={0}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={Enum.Font.ArialBold}
				/>
			</frame>
		</frame>
	);
}

export default withHooks(Money);
