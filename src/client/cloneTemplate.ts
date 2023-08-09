import { Children, New } from "@rbxts/fusion";

const billboardGui = New("BillboardGui")({
	AlwaysOnTop: true,
	Enabled: true,
	Size: new UDim2(0, 50, 20, 0),
	[Children]: [
		New("TextLabel")({
			Size: UDim2.fromScale(1, 1),
			BackgroundTransparency: 1,
			BorderColor3: Color3.fromRGB(27, 42, 53),
			BorderSizePixel: 1,
			TextStrokeTransparency: 1,
			TextColor3: Color3.fromRGB(255, 255, 255),
			TextSize: 15,
			TextXAlignment: Enum.TextXAlignment.Left,
			TextYAlignment: Enum.TextYAlignment.Top,
		}),
	],
});

export = (): BillboardGui & { TextLabel: TextLabel } => {
	return billboardGui.Clone() as BillboardGui & { TextLabel: TextLabel };
};
