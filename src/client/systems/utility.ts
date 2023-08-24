import { Balance, BelongsTo, Client, Renderable, Utility } from "shared/components";
import { getNextLevelCost, updateUtilityInfo } from "client/methods";
import { fetchComponent, getOrError } from "shared/util";
import { ClientState } from "shared/clientState";
import { Players } from "@rbxts/services";
import { World } from "@rbxts/matter";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

const player = Players.LocalPlayer;

function utility(world: World, state: ClientState) {
	const maid = new Maid();

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (!utility.old && utility.new) {
			const belongsTo = getOrError(world, id, BelongsTo, "Utility does not have BelongsTo component");
			const playerId = belongsTo.playerId;
			Log.Info(`Utility {@ID} belongs to player {@PlayerID}`, id, playerId);
			const clientPlayer = getOrError(world, playerId, Client, "Cannot find player based on Utility");
			if (clientPlayer.player.UserId !== player.UserId) continue;
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
					state.utilityUpgrade = fetchComponent(world, id, Utility);
					const nextLevelCost = getNextLevelCost(world, id);
					const balance = getOrError(
						world,
						state.playerId!,
						Balance,
						"Player {@ID} does not have a Balance component",
					);
					utilInfo.Background.Upgrade.BackgroundColor3 =
						balance.balance >= nextLevelCost ? Color3.fromRGB(76, 229, 11) : Color3.fromRGB(229, 20, 5);
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
