import { Children, New } from "@rbxts/fusion";
import { Workspace } from "@rbxts/services";

const camera = Workspace.CurrentCamera!;

function updateLine(
	line: Frame,
	from: Vector2,
	to: Vector2,
	colour: Color3,
	visible: boolean,
	transparency: number,
): void {
	if (visible) {
		line.BackgroundColor3 = colour;
		line.AnchorPoint = new Vector2(0.5, 0.5);
		line.Position = UDim2.fromOffset((from.X + to.X) / 2, (from.Y + to.Y) / 2);
		line.Size = UDim2.fromOffset(((to.X - from.X) ** 2 + (to.Y - from.Y) ** 2) ** 0.5, 3);
		line.Rotation = math.atan2(to.Y - from.Y, to.X - from.X) * (180 / math.pi);
		line.Transparency = transparency;
	}

	line.Visible = visible;
}

function drawLine(props: Partial<WritableInstanceProperties<Frame>>): Frame {
	return New("Frame")(props);
}

export function updateLineBox(
	target: Instance & {
		topLeft: Frame;
		topRight: Frame;
		bottomLeft: Frame;
		bottomRight: Frame;
	},
	cf: CFrame,
	size: Vector3,
	colour: Color3,
	transparency: number,
): void {
	const [topLeftPos, topLeftVisible] = camera.WorldToViewportPoint(cf.mul(new CFrame(size.X, size.Y, 0)).Position);
	const [topRightPos, topRightVisible] = camera.WorldToViewportPoint(cf.mul(new CFrame(-size.X, size.Y, 0)).Position);
	const [bottomLeftPos, bottomLeftVisible] = camera.WorldToViewportPoint(
		cf.mul(new CFrame(size.X, -size.Y, 0)).Position,
	);
	const [bottomRightPos, bottomRightVisible] = camera.WorldToViewportPoint(
		cf.mul(new CFrame(-size.X, -size.Y, 0)).Position,
	);

	updateLine(
		target.topLeft,
		new Vector2(topLeftPos.X, topLeftPos.Y),
		new Vector2(topRightPos.X, topRightPos.Y),
		colour,
		topLeftVisible,
		transparency,
	);

	updateLine(
		target.topRight,
		new Vector2(topRightPos.X, topRightPos.Y),
		new Vector2(bottomRightPos.X, bottomRightPos.Y),
		colour,
		topRightVisible,
		transparency,
	);

	updateLine(
		target.bottomLeft,
		new Vector2(bottomLeftPos.X, bottomLeftPos.Y),
		new Vector2(topLeftPos.X, topLeftPos.Y),
		colour,
		bottomLeftVisible,
		transparency,
	);

	updateLine(
		target.bottomRight,
		new Vector2(bottomRightPos.X, bottomRightPos.Y),
		new Vector2(bottomLeftPos.X, bottomLeftPos.Y),
		colour,
		bottomRightVisible,
		transparency,
	);
}

export function createLineBox(): ScreenGui & {
	topLeft: Frame;
	topRight: Frame;
	bottomLeft: Frame;
	bottomRight: Frame;
} {
	return New("ScreenGui")({
		Enabled: true,
		IgnoreGuiInset: true,

		[Children]: {
			topLeft: drawLine({ Name: "topLeft" }),
			topRight: drawLine({ Name: "topRight" }),
			bottomLeft: drawLine({ Name: "bottomLeft" }),
			bottomRight: drawLine({ Name: "bottomRight" }),
		},
	}) as never;
}
