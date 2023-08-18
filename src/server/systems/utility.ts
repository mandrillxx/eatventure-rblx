import { Holding, Renderable, Utility } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

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
}

export = utility;
