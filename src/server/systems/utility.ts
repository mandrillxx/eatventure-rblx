import { Balance, Holding, OwnedBy, Renderable, SoundEffect, Utility } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { Network } from "shared/network";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

const handleUpgrade = (world: World, player: Player, state: ServerState, id: AnyEntity) => {
	const playerId = state.clients.get(player.UserId)!;
	const balance = getOrError(world, playerId, Balance, "Player {@ID} does not have a Balance component");
	const newUtility = getOrError(world, id, Utility, "Utility no longer exists");
	const { baseUpgradeCost, xpLevel } = newUtility;
	const xpBias = xpLevel > 100 ? 1.35 : 1.2;
	const nextLevelCost = baseUpgradeCost * (xpBias ** xpLevel - 1);
	if (state.verbose) Log.Info("Next level cost: {@Cost} | {@Balance}", nextLevelCost, balance.balance);
	if (newUtility.xpLevel >= 250) {
		world.insert(id, SoundEffect({ sound: "Fail" }));
		Log.Warn("Utility {@UtilityID} is already max level", id);
		return;
	}
	if (balance.balance < nextLevelCost) {
		world.insert(id, SoundEffect({ sound: "Fail" }));
		Log.Warn("Player {@ID} does not have enough money to upgrade utility {@UtilityID}", playerId, id);
		return;
	}
	if (state.debug) Log.Warn("Upgrading utility {@UtilityID} for player {@ID}", id, playerId);
	const nextLevel = newUtility.xpLevel + 1;
	world.insert(playerId, balance.patch({ balance: balance.balance - nextLevelCost }));
	world.insert(id, newUtility.patch({ xpLevel: nextLevel }), SoundEffect({ sound: "Upgrade" }));
};

function utility(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	for (const [id, utility] of world.queryChanged(Utility)) {
		const maid = maids.get(id);

		if (!utility.old && utility.new) {
			const renderable = getOrError(world, id, Renderable, "Utility {@ID} does not have a Renderable component");
			const model = renderable.model as BaseUtility;
			if (!maid) {
				const maid = new Maid();
				const levelId = utility.new.level.componentId;
				maid.GiveTask(
					Network.upgradeUtility.server.connect((requestedPlayer, adornee) => {
						if (!world.contains(id) || !world.contains(levelId)) return;
						const ownedBy = getOrError(world, levelId, OwnedBy);
						const player = ownedBy.player;
						if (player !== requestedPlayer || !adornee || adornee.Name !== model.Name) return;
						handleUpgrade(world, player, state, id);
					}),
				);
				maids.set(id, maid);
			}
		}
		if (utility.old && !utility.new) {
			if (maids.has(id)) {
				const maid = maids.get(id)!;
				maids.delete(id);
				maid.DoCleaning();
			}
		}
	}

	for (const [id, holding] of world.queryChanged(Holding)) {
		if (holding.old && holding.new) {
			const outOfStockProducts = holding.new.product.filter((product) => product.amount <= 0);
			if (outOfStockProducts.isEmpty()) continue;
			if (outOfStockProducts.size() === holding.new.product.size()) {
				if (state.verbose) Log.Info("Removing holding component from {@ID}", id);
				world.remove(id, Holding);
				continue;
			}
			world.insert(
				id,
				holding.new.patch({
					product: holding.new.product.filter((product) => product.amount > 0),
				}),
			);
		}
	}
}

export = utility;
