import { Renderable, Utility } from "shared/components";
import { updateUtilityInfo } from "client/methods";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Players } from "@rbxts/services";
import { World } from "@rbxts/matter";
import Maid from "@rbxts/maid";

const player = Players.LocalPlayer;

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
			maid.GiveTask(
				model.ClickDetector.MouseClick.Connect(() => {
					const utilInfo = player
						.FindFirstChildOfClass("PlayerGui")!
						.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
					const utility = getOrError(world, id, Utility, "Utility {@ID} no longer exists");
					updateUtilityInfo(utilInfo, utility, world, id);
					utilInfo.Adornee = utilInfo.Adornee === model ? undefined : model;
					utilInfo.Enabled = utilInfo.Adornee === model;
				}),
			);
		}
		if (utility.old && !utility.new) {
			maid.DoCleaning();
		}
	}
}

export = utility;
