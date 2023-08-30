import { Balance, BelongsTo, Level, OpenStatus, OwnedBy, Renderable, Upgrade, Utility } from "shared/components";
import { ServerEntityIdToClient, getNextLevelCost, updateUtilityInfo } from "client/methods";
import { getLevelUtilityAmount, getPlayerMaxedUtilities } from "shared/methods";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { Players } from "@rbxts/services";
import Log from "@rbxts/log";

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
		const belongsTo = getOrError(world, id, BelongsTo, "Utility does not have BelongsTo component");
		if (ServerEntityIdToClient(state, belongsTo.playerId) !== state.playerId) continue;

		if (utility.new) {
			if (!world.contains(ServerEntityIdToClient(state, belongsTo.levelId)!)) continue;
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
			if (!world.contains(id) || !world.contains(state.playerId!)) continue;
			const newUtility = getOrError(world, id, Utility, "Utility no longer exists");
			const nextLevelCost = getNextLevelCost(world, id, newUtility);
			const balance = getOrError(
				world,
				state.playerId!,
				Balance,
				"Player {@ID} does not have a Balance component",
			);
			utilityInfo.Background.Upgrade.BackgroundColor3 =
				balance.balance >= nextLevelCost && newUtility.xpLevel + 1 < 150
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
			const overlay = player.FindFirstChildOfClass("PlayerGui")!.FindFirstChild("Overlay")! as NewOverlayGui;
			const renovate = overlay.Renovate;
			const playerInfo = overlay.PlayerInfo;
			playerInfo.Info.Counter.InfoText.TextLabel.Text = level.new.name.sub(-1, -1);
			playerInfo.Info.Counter.InfoText["TextLabel - Stroke"].Text = level.new.name.sub(-1, -1);
			renovate.Content.Footer.Purchase.BtnText.TextLabel.Text = `$${FormatCompact(level.new.prestigeCost, 1)}`;
			renovate.Content.Footer.Purchase.BtnText["TextLabel - Stroke"].Text = `$${FormatCompact(
				level.new.prestigeCost,
				1,
			)}`;
			renovate.Content.Footer.CantAfford.BtnText.TextLabel.Text = `$${FormatCompact(level.new.prestigeCost, 1)}`;
			renovate.Content.Footer.CantAfford.BtnText["TextLabel - Stroke"].Text = `$${FormatCompact(
				level.new.prestigeCost,
				1,
			)}`;
		}
	}

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (id !== state.playerId!) continue;
		if (balance.new) {
			if (!world.contains(state.levelId!)) continue;
			const level = getOrError(world, state.levelId!, Level, "Level does not have Level component");
			const playerMaxedUtilities = getPlayerMaxedUtilities(world, state.playerId!, state.levelId!);
			const levelUtilities = getLevelUtilityAmount(world, state.levelId!);
			const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
			const overlay = playerGui.FindFirstChild("Overlay") as NewOverlayGui;
			const renovate = overlay.Renovate;

			const prestigeCost = `$${FormatCompact(level.prestigeCost, 1)}`;
			const canPrestige = playerMaxedUtilities >= levelUtilities;
			const prestigeRequirements = `(${playerMaxedUtilities}/${levelUtilities})`;
			renovate.Content.Footer.Purchase.BtnText.TextLabel.Text = `${prestigeCost} ${prestigeRequirements}`;
			renovate.Content.Footer.Purchase.BtnText[
				"TextLabel - Stroke"
			].Text = `${prestigeCost} ${prestigeRequirements}`;
			renovate.Content.Footer.NotReady.BtnText.TextLabel.Text = `${prestigeCost} ${prestigeRequirements}`;
			renovate.Content.Footer.NotReady.BtnText[
				"TextLabel - Stroke"
			].Text = `${prestigeCost} ${prestigeRequirements}`;
			renovate.Content.Footer.CantAfford.BtnText.TextLabel.Text = `${prestigeCost} ${prestigeRequirements}`;
			renovate.Content.Footer.CantAfford.BtnText[
				"TextLabel - Stroke"
			].Text = `${prestigeCost} ${prestigeRequirements}`;
			if (balance.new.balance >= level.prestigeCost) {
				renovate.Content.Footer.Purchase.Visible = canPrestige;
				renovate.Content.Footer.NotReady.Visible = !canPrestige;
				renovate.Content.Footer.CantAfford.Visible = false;
			} else {
				renovate.Content.Footer.Purchase.Visible = false;
				renovate.Content.Footer.NotReady.Visible = false;
				renovate.Content.Footer.CantAfford.Visible = true;
			}

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
				balance.new.balance >= nextLevelCost && utility.component.xpLevel < 150
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
			if (!world.contains(state.levelId!)) continue;
			const levelModel = getOrError(
				world,
				state.levelId!,
				Renderable,
				"level does not contain renderable component",
			).model as BaseLevel;

			for (const _utility of levelModel.Utilities.GetChildren()) {
				const utilityId = ServerEntityIdToClient(state, _utility.GetAttribute("serverId") as AnyEntity)!;
				if (!world.contains(utilityId)) {
					Log.Warn("Utility {@UtilityId} no longer exists", utilityId);
					continue;
				}
				const utility = getOrError(world, utilityId, Utility, "cannot find utility component");
				const { baseUpgradeCost, xpLevel } = utility;
				if (xpLevel + 1 > 150) {
					(_utility as BaseUtility).UpgradeGui.Enabled = false;
					continue;
				}
				const xpBias = xpLevel > 100 ? 1.2025 : 1.2;
				const nextLevelCost = baseUpgradeCost * (xpBias ** xpLevel - 1);
				if (balance.new.balance >= nextLevelCost && utility.xpLevel < 150 && utility.unlocked) {
					(_utility as BaseUtility).UpgradeGui.Enabled = true;
				} else if (balance.new.balance < nextLevelCost && (_utility as BaseUtility).UpgradeGui.Enabled) {
					(_utility as BaseUtility).UpgradeGui.Enabled = false;
				}
			}
		}
	}
}

export = state;
