import { Balance, BelongsTo, Client, OwnedBy, Renderable, Upgrade, Utility } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { updateUpgrades } from "server/components/levelUpgrade";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";

function state(world: World, state: ServerState) {
	const getProfile = (player: Player) => {
		const profile = state.profiles.get(player);
		if (!profile) {
			throw "No profile found for player";
		}
		return profile;
	};

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new) {
			const client = getOrError(world, id, Client);
			const levelId = state.levels.get(client.player.UserId)!.levelId;
			const levelModel = getOrError(world, levelId, Renderable).model as BaseLevel;

			for (const _utility of levelModel.Utilities.GetChildren()) {
				const utilityId = _utility.GetAttribute("serverId") as AnyEntity;
				const utility = getOrError(world, utilityId, Utility);
				const { baseUpgradeCost, xpLevel } = utility;
				if (xpLevel + 1 > 250) continue;
				const xpBias = xpLevel > 100 ? 1.205 : 1.2;
				const nextLevelCost = baseUpgradeCost * (xpBias ** xpLevel - 1);
				if (balance.new.balance >= nextLevelCost) {
					if (state.verbose) Log.Info("Utility {@ID} can be upgraded, showing GUI", utilityId);
					(_utility as BaseUtility).UpgradeGui.Enabled = true;
				} else if (balance.new.balance < nextLevelCost && (_utility as BaseUtility).UpgradeGui.Enabled) {
					if (state.verbose) Log.Info("Utility {@ID} can no longer be upgraded, hiding GUI", utilityId);
					(_utility as BaseUtility).UpgradeGui.Enabled = false;
				}
			}
		}
	}

	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new) {
			const client = getOrError(world, id, Client);
			const player = client.player;
			const profile = getProfile(player);
			profile.Data.money = balance.new.balance;
			const upgradeInfo = (player.FindFirstChildOfClass("PlayerGui")!.FindFirstChild("Overlay")! as NewOverlayGui)
				.Upgrades;
			updateUpgrades({
				firstRun: false,
				world,
				playerId: id,
				upgradeInfo,
				profile,
			});
		}
	}

	for (const [id, upgrade] of world.queryChanged(Upgrade)) {
		if (upgrade.old && upgrade.new && upgrade.new.purchased !== upgrade.old.purchased) {
			const belongsTo = getOrError(world, id, BelongsTo);
			const client = getOrError(world, belongsTo.playerId, Client);
			const player = client.player;
			const profile = getProfile(player);
			const upgradeInfo = (player.FindFirstChildOfClass("PlayerGui")!.FindFirstChild("Overlay")! as NewOverlayGui)
				.Upgrades;
			updateUpgrades({
				firstRun: false,
				world,
				playerId: belongsTo.playerId,
				upgradeInfo,
				profile,
			});
		}
	}

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (utility.old && utility.new && utility.old.xpLevel !== utility.new.xpLevel) {
			if (state.verbose)
				Log.Warn(
					"Utility {@ID} level changed from {@Old} to {@New}",
					id,
					utility.old.xpLevel,
					utility.new.xpLevel,
				);
			const ownedBy = getOrError(world, utility.new.level.componentId, OwnedBy);
			const player = ownedBy.player;
			const utilitiesFolder = player.FindFirstChild("Utilities") as Folder;
			const utilityLevel = utilitiesFolder.FindFirstChild(utility.new.type) as IntValue | undefined;
			if (!utilityLevel) {
				if (state.verbose) Log.Info("Creating new utility level intvalue for {@Utility}", utility.new.type);
				New("IntValue")({
					Name: utility.new.type,
					Value: utility.new.xpLevel,
					Parent: utilitiesFolder,
				});
			} else {
				if (state.verbose)
					Log.Info(
						"Updating utility level intvalue to {@Level} for {@Utility}",
						utility.new.xpLevel,
						utility.new.type,
					);
				utilityLevel.Value = utility.new.xpLevel;
			}
			const profile = getProfile(player);
			profile.Data.utilityLevels.set(utility.new.type, utility.new.xpLevel);
		}
		if (utility.old && utility.new && utility.old.every !== utility.new.every) {
			const levelRenderable = getOrError(world, utility.new.level.componentId, Renderable).model as BaseLevel;
			const utilityModel = levelRenderable.Utilities.FindFirstChild(utility.new.type) as BaseUtility;
			utilityModel.Every.Value = utility.new.every;
		}
	}
}

export = state;
