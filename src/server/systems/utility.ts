import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Holding, Renderable, Utility } from "shared/components";

function utility(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

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

	for (const [id, utility] of world.queryChanged(Utility)) {
		if (!utility.old && utility.new) {
			const renderable = world.get(id, Renderable);
			if (!renderable) {
				Log.Error("Utility {@ID} does not have a renderable component", id);
				continue;
			}
			const maid = maids.set(id, new Maid()).get(id)!;
			const model = renderable.model as BaseUtility;
			maid.GiveTask(
				model.ClickDetector.MouseClick.Connect((player) => {
					const playerId = state.clients.get(player.UserId)!;
					const holding = world.get(playerId, Holding);
					if (!world.contains(id)) {
						Log.Error("Utility {@ID} does not exist in the world", id);
						maid.DoCleaning();
						return;
					}
					if (!holding) {
						world.insert(
							playerId,
							Holding({
								product: [utility.new!.makes],
							}),
						);
						if (state.verbose)
							Log.Info(
								"Player {@Player} is now holding {@Product} after being inserted",
								player,
								utility.new!.makes,
							);
						return;
					}
					const holdingMadeProduct = holding.product.find(
						(product) => product.product === utility.new!.makes.product,
					);
					Log.Debug("Holding made product: {@Product}", holdingMadeProduct);
					if (!holdingMadeProduct) {
						world.insert(
							playerId,
							holding.patch({
								product: [...holding.product, utility.new!.makes],
							}),
						);
						if (state.verbose)
							Log.Info("Player {@Player} is now holding {@Product}", player, utility.new!.makes);
						return;
					}
					const alreadyHoldingAmount = holdingMadeProduct.amount;
					world.insert(
						playerId,
						holding.patch({
							product: [
								...holding.product.filter((product) => product.product !== utility.new!.makes.product),
								utility.new!.makes.patch({ amount: alreadyHoldingAmount + utility.new!.makes.amount }),
							],
						}),
					);
				}),
			);
		}
		if (utility.old && !utility.new) {
			const maid = maids.get(id)!;
			maid.DoCleaning();
			maids.delete(id);
		}
	}
}

export = utility;
