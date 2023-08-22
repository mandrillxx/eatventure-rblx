import { Renderable, Utility } from "shared/components";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { World } from "@rbxts/matter";
import Maid from "@rbxts/maid";

function utility(world: World, _: ClientState) {
	const maid = new Maid();

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (!utility.old && utility.new) {
			const renderable = getOrError(world, id, Renderable, "Utility {@ID} does not have a Renderable component");
			const model = renderable.model as BaseUtility;
			maid.GiveTask(
				model.ClickDetector.MouseHoverEnter.Connect(() => {
					model.SelectionBox.Visible = true;
				}),
			);
			maid.GiveTask(
				model.ClickDetector.MouseHoverLeave.Connect(() => {
					model.SelectionBox.Visible = false;
				}),
			);
		}
		if (utility.old && !utility.new) {
			maid.DoCleaning();
		}
	}
}

export = utility;
