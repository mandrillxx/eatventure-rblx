import { Balance, BelongsTo, Level, OpenStatus, OwnedBy, Upgrade, Utility } from "shared/components";
import { ServerEntityIdToClient, getNextLevelCost, updateUtilityInfo } from "client/methods";
import { World, useThrottle } from "@rbxts/matter";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Players } from "@rbxts/services";

const player = Players.LocalPlayer as BasePlayer;

function state(world: World, state: ClientState) {
	if (useThrottle(1)) {
		for (const [id, openStatus] of world.queryChanged(OpenStatus)) {
			if (openStatus.new) {
				const ownedBy = getOrError(world, id, OwnedBy, "OpenStatus does not have OwnedBy component");
				if (ownedBy.player.UserId !== player.UserId) continue;
				state.update("open", openStatus.new.open);
			}
		}
	}
	for (const [id, utility] of world.queryChanged(Utility)) {
		if (utility.new) {
			const belongsTo = getOrError(world, id, BelongsTo, "Utility does not have BelongsTo component");
			const ownedBy = getOrError(
				world,
				ServerEntityIdToClient(state, belongsTo.levelId)!,
				OwnedBy,
				"Utility does not have OwnedBy component",
			);
			if (ownedBy.player.UserId !== player.UserId) continue;
			const utilityInfo = player
				.FindFirstChildOfClass("PlayerGui")!
				.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
			if (!utilityInfo.Enabled || utilityInfo.Adornee?.Name !== utility.new.type) continue;
			const newUtility = getOrError(world, id, Utility, "Utility no longer exists");
			const nextLevelCost = getNextLevelCost(world, id, newUtility);
			const balance = getOrError(
				world,
				state.playerId!,
				Balance,
				"Player {@ID} does not have a Balance component",
			);
			utilityInfo.Background.Upgrade.BackgroundColor3 =
				balance.balance >= nextLevelCost && newUtility.xpLevel + 1 < 250
					? Color3.fromRGB(76, 229, 11)
					: Color3.fromRGB(229, 20, 5);
			updateUtilityInfo(utilityInfo, utility.new, world, id);
		}
	}

	for (const [id, _level] of world.queryChanged(Level)) {
		const ownedBy = getOrError(world, id, OwnedBy, "Level does not have OwnedBy component");
		if (ownedBy.player.UserId !== player.UserId) continue;
		state.levelId = id;
	}

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new) {
			if (id === state.playerId) {
				const utilityInfo = player
					.FindFirstChildOfClass("PlayerGui")!
					.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
				const utility = state.utilityUpgrade;
				if (!utility || !utilityInfo.Enabled || utilityInfo.Adornee?.Name !== utility.component.type) continue;
				const nextLevelCost = getNextLevelCost(world, utility.componentId);
				utilityInfo.Background.Upgrade.BackgroundColor3 =
					balance.new.balance >= nextLevelCost && utility.component.xpLevel < 250
						? Color3.fromRGB(76, 229, 11)
						: Color3.fromRGB(229, 20, 5);
			}
		}
	}

	for (const [_id, balance] of world.queryChanged(Balance)) {
		if (balance.new && state.levelId) {
			const openUpgrades = (player.FindFirstChildOfClass("PlayerGui")!.FindFirstChild("Overlay") as OverlayGui)
				.OpenUpgrades;

			let upgradesCanAfford = 0;
			for (const [_id, upgrade, belongsTo] of world.query(Upgrade, BelongsTo)) {
				if (ServerEntityIdToClient(state, belongsTo.levelId) !== state.levelId) continue;
				if (upgrade.cost <= balance.new.balance && !upgrade.purchased) {
					upgradesCanAfford++;
				}
			}

			if (upgradesCanAfford === 0) {
				openUpgrades.TextLabel.Visible = false;
				continue;
			}
			openUpgrades.TextLabel.Text = tostring(upgradesCanAfford);
			openUpgrades.TextLabel.Visible = true;
		}
	}
}

export = state;
