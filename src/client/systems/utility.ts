import { World } from "@rbxts/matter";
import { ClientState } from "shared/clientState";
import { Renderable, Utility } from "shared/components";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

function utility(world: World, _: ClientState) {
	const maid = new Maid();

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (!utility.old && utility.new) {
			const renderable = world.get(id, Renderable);
			if (!renderable) {
				Log.Error("Utility {@ID} does not have a renderable component", id);
				continue;
			}
			const model = renderable.model as BaseUtility;
			maid.GiveTask(
				model.ClickDetector.MouseHoverEnter.Connect((player) => {
					model.SelectionBox.Visible = true;
				}),
			);
			maid.GiveTask(
				model.ClickDetector.MouseHoverLeave.Connect((player) => {
					model.SelectionBox.Visible = false;
				}),
			);
			maid.GiveTask(model.ClickDetector.MouseClick.Connect((player) => {}));
		}
		if (utility.old && !utility.new) {
			maid.DoCleaning();
		}
	}
}

export = utility;