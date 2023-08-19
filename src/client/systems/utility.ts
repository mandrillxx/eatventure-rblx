import { Renderable, Utility } from "shared/components";
import { ClientState } from "shared/clientState";
import { World } from "@rbxts/matter";
import { getOrError } from "shared/util";
import Maid from "@rbxts/maid";

function utility(world: World, _: ClientState) {
	const maid = new Maid();

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (!utility.old && utility.new) {
			const renderable = getOrError(world, id, Renderable, "Utility {@ID} does not have a Renderable component");
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
