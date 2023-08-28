import { Balance, BelongsTo, Level, OpenStatus, OwnedBy, Renderable, Upgrade, Utility } from "shared/components";
import { ServerEntityIdToClient, getNextLevelCost, updateUtilityInfo } from "client/methods";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Players } from "@rbxts/services";

const player = Players.LocalPlayer as BasePlayer;

function state(world: World, state: ClientState) {
	if (useThrottle(1)) {
		for (const [id, openStatus] of world.queryChanged(OpenStatus)) {
			if (openStatus.new) {
				const ownedBy = getOrError(world, id, OwnedBy, "OpenStatus does not have OwnedBy component");
				if (ownedBy.player !== player) continue;
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
			if (ownedBy.player !== player) continue;
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

	for (const [id, level] of world.queryChanged(Level)) {
		if (!level.old && level.new) {
			const ownedBy = getOrError(world, id, OwnedBy, "Level does not have OwnedBy component");
			if (ownedBy.player !== player) continue;
			state.levelId = id;
		}
	}

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (id !== state.playerId!) continue;
		if (balance.new) {
			const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
			const overlay = playerGui.FindFirstChild("Overlay") as NewOverlayGui;
			const playerInfo = overlay.PlayerInfo;
			const settings = overlay.Settings;
			playerInfo.Bars.Progress.Cash.Text.TextLabel.Text = `$${FormatCompact(
				balance.new.balance,
				balance.new.balance > 1_000_000 ? 1 : 2,
			)}`;
			playerInfo.Bars.Progress.Cash.Text["TextLabel - Stroke"].Text = `$${FormatCompact(
				balance.new.balance,
				balance.new.balance > 1_000_000 ? 1 : 2,
			)}`;
			settings.Content.Body.Cash.Text.TextLabel.Text = `$${FormatCompact(
				balance.new.balance,
				balance.new.balance > 1_000_000 ? 1 : 2,
			)}`;
			settings.Content.Body.Cash.Text["TextLabel - Stroke"].Text = `$${FormatCompact(
				balance.new.balance,
				balance.new.balance > 1_000_000 ? 1 : 2,
			)}`;
			const utilityInfo = playerGui.FindFirstChild("UtilityInfo")! as UtilityInfoInstance;
			const utility = state.utilityUpgrade;
			if (!utility || !utilityInfo.Enabled || utilityInfo.Adornee?.Name !== utility.component.type) continue;
			const nextLevelCost = getNextLevelCost(world, utility.componentId);
			utilityInfo.Background.Upgrade.BackgroundColor3 =
				balance.new.balance >= nextLevelCost && utility.component.xpLevel < 250
					? Color3.fromRGB(76, 229, 11)
					: Color3.fromRGB(229, 20, 5);
		}
	}

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (id !== state.playerId!) continue;
		if (balance.new && state.levelId) {
			const openUpgrades = (player.FindFirstChildOfClass("PlayerGui")!.FindFirstChild("Overlay") as OverlayGui)
				.OpenUpgrades;

			let upgradesCanAfford = 0;
			for (const [_id, upgrade, belongsTo] of world.query(Upgrade, BelongsTo)) {
				if (ServerEntityIdToClient(state, belongsTo.levelId) !== state.levelId) continue;
				if (upgrade.cost <= balance.new.balance && !upgrade.purchased && !upgrade.ran) {
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

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (id !== state.playerId! || !state.levelId) continue;
		if (balance.new) {
			const levelModel = getOrError(
				world,
				state.levelId!,
				Renderable,
				"level does not contain renderable component",
			).model as BaseLevel;

			for (const _utility of levelModel.Utilities.GetChildren()) {
				const utilityId = ServerEntityIdToClient(state, _utility.GetAttribute("serverId") as AnyEntity)!;
				const utility = getOrError(world, utilityId, Utility, "cannot find utility component");
				const { baseUpgradeCost, xpLevel } = utility;
				if (xpLevel + 1 > 250) continue;
				const xpBias = xpLevel > 100 ? 1.205 : 1.2;
				const nextLevelCost = baseUpgradeCost * (xpBias ** xpLevel - 1);
				if (balance.new.balance >= nextLevelCost) {
					(_utility as BaseUtility).UpgradeGui.Enabled = true;
				} else if (balance.new.balance < nextLevelCost && (_utility as BaseUtility).UpgradeGui.Enabled) {
					(_utility as BaseUtility).UpgradeGui.Enabled = false;
				}
			}
		}
	}
}

export = state;
