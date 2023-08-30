import { AnyEntity, World } from "@rbxts/matter";
import { TweenService } from "@rbxts/services";
import { UIHoverAnim } from "client/components/game";
import Log from "@rbxts/log";

const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

const Scale = (uiElement: GuiObject) => {
	return {
		Size: uiElement.Size.add(new UDim2(0.1, 0, 0.1, 0)),
	};
};

const Rotate = (uiElement: GuiObject) => {
	return {
		Rotation: 30,
	};
};

const ScaleAndRotate = (uiElement: GuiObject) => {
	return {
		...Scale(uiElement),
		...Rotate(uiElement),
	};
};

function animate(uiElement: GuiObject, animType: "Scale" | "Rotate" | "ScaleAndRotate") {
	return;
}

function ui(world: World) {
	const tweens: Map<AnyEntity, Tween> = new Map();

	for (const [id, anim] of world.queryChanged(UIHoverAnim)) {
		if (!anim.old && anim.new) {
			const { uiElement, animType } = anim.new;
			const tween = TweenService.Create(
				uiElement,
				tweenInfo,
				animType === "Scale"
					? Scale(uiElement)
					: animType === "Rotate"
					? Rotate(uiElement)
					: ScaleAndRotate(uiElement),
			);
			world.insert(
				id,
				anim.new.patch({
					undo: () => {
						if (!tween) return;
						tween.Cancel();
						tween;
					},
				}),
			);
			tweens.set(id, tween);
		}
		if (anim.old && !anim.new) {
			const tween = tweens.get(id);
			if (!tween) {
				Log.Warn("No tween found for UIHoverAnim");
				continue;
			}
		}
	}
}

export = ui;
