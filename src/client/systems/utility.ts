import { ServerEntityIdToClient, getNextLevelCost, updateUtilityInfo, updateUtilityUnlockInfo } from "client/methods";
import { Balance, BelongsTo, OwnedBy, Renderable, SoundEffect, Utility } from "shared/components";
import { fetchComponent, getOrError } from "shared/util";
import { AnyEntity, World } from "@rbxts/matter";
import { ClientState } from "shared/clientState";
import { Players } from "@rbxts/services";
import Maid from "@rbxts/maid";

const player = Players.LocalPlayer;

function utility(world: World, state: ClientState) {
	const maid = new Maid();

	function setupUtilityGui(model: BaseUtility, id: AnyEntity) {
		task.delay(0.5, () => {
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
					world.spawn(SoundEffect({ sound: "UIClick", meantFor: player }));
					const utilInfo = player
						.FindFirstChildOfClass("PlayerGui")!
						.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
					if (!world.contains(id)) return;
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
		});
	}

	for (const [id, utility] of world.queryChanged(Utility)) {
		const belongsTo = getOrError(world, id, BelongsTo, "Utility does not have BelongsTo component");
		const ownedBy = getOrError(
			world,
			ServerEntityIdToClient(state, belongsTo.levelId)!,
			OwnedBy,
			"Utility does not have OwnedBy component",
		);
		if (ownedBy.player !== player) continue;
		if (!utility.old && utility.new) {
			const renderable = getOrError(world, id, Renderable, "Utility {@ID} does not have a Renderable component");
			const model = renderable.model as BaseUtility;
			if (!utility.new.unlocked) {
				model.SelectionBox.SurfaceTransparency = 0.15;
				task.delay(0.5, () => {
					maid.GiveTask(
						model.ClickDetector.MouseClick.Connect(() => {
							world.spawn(SoundEffect({ sound: "UIClick", meantFor: player }));
							if (!world.contains(id)) return;
							const balance = getOrError(
								world,
								state.playerId!,
								Balance,
								"Player {@ID} does not have a Balance component",
							);

							const unlockGui = player
								.FindFirstChildOfClass("PlayerGui")!
								.FindFirstChild("UnlockGui")! as UnlockGuiInstance;
							const utility = getOrError(world, id, Utility, "Utility {@ID} no longer exists");
							if (utility.unlocked) return;
							state.utilityUpgrade = fetchComponent(world, id, Utility);

							unlockGui.Background.Unlock.BackgroundColor3 =
								balance.balance >= model.UnlockCost.Value
									? Color3.fromRGB(76, 229, 11)
									: Color3.fromRGB(229, 20, 5);
							updateUtilityUnlockInfo(unlockGui, utility);
							unlockGui.Adornee = unlockGui.Adornee === model ? undefined : model;
							unlockGui.Enabled = unlockGui.Adornee === model;
						}),
					);
				});
				continue;
			}
			setupUtilityGui(model, id);
		}
		if (utility.old && utility.new && !utility.old.unlocked && utility.new.unlocked) {
			const renderable = getOrError(world, id, Renderable, "Utility {@ID} does not have a Renderable component");
			const model = renderable.model as BaseUtility;
			maid.DoCleaning();
			const unlockGui = player
				.FindFirstChildOfClass("PlayerGui")!
				.FindFirstChild("UnlockGui")! as UnlockGuiInstance;
			unlockGui.Enabled = false;
			unlockGui.Adornee = undefined;

			setupUtilityGui(model, id);
		}
		if (utility.old && !utility.new) {
			maid.DoCleaning();
		}
	}
}

export = utility;
