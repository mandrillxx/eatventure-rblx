import { AnyEntity, World } from "@rbxts/matter";
import { Balance, BelongsTo, Client, Holding, Utility, Wants } from "shared/components";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

interface GiveItem {
	player?: Player;
	entity?: AnyEntity;
	world: World;
	maid?: Maid;
	id: AnyEntity;
	wants: Wants;
	state: ServerState;
	utility: Utility;
}

export function giveItem({ player, entity, world, maid, id, wants, state, utility }: GiveItem) {
	if (!world.contains(id) || !wants) return;
	const currentWants = world.get(id, Wants);
	if (!currentWants) {
		if (state.verbose) Log.Info("Customer no longer wants anything, cleaning up");
		if (maid) maid.DoCleaning();
		return;
	}

	if (!player && !entity) {
		Log.Error("No player or entity provided");
		return;
	}

	const entityId = player ? state.clients.get(player.UserId)! : entity!;
	const entityHolding = world.get(entityId, Holding);
	if (!entityHolding) {
		if (state.verbose) Log.Info("Entity not holding anything, cannot provide for NPC");
		return;
	}
	const entityHoldingRequestedProduct = entityHolding.product.find(
		(product) => product.product === currentWants.product.product,
	);
	if (!entityHoldingRequestedProduct) {
		if (state.verbose) Log.Info("Entity not holding requested product, cannot provide for NPC");
		return;
	}
	world.insert(
		entityId,
		entityHolding.patch({
			product: [
				...entityHolding.product.filter((product) => product.product !== entityHoldingRequestedProduct.product),
				{
					...entityHoldingRequestedProduct,
					amount: entityHoldingRequestedProduct.amount - 1,
				},
			],
		}),
	);
	const benefitingPlayer = player
		? state.clients.get(player.UserId)!
		: state.clients.get(getOrError(world, entity!, BelongsTo).client.player.UserId)!;
	const client = getOrError(world, benefitingPlayer, Client);
	const balance = getOrError(world, benefitingPlayer, Balance);
	world.insert(
		benefitingPlayer,
		balance.patch({ balance: balance.balance + utility.reward * client.document.coinMultiplier }),
	);
	if (currentWants.product.amount === 1) {
		if (state.verbose) Log.Info("NPC {@NPC} got what they wanted", id);
		world.remove(id, Wants);
	} else {
		if (state.verbose) Log.Info("NPC {@NPC} got what they wanted, but still wants more", id);
		world.insert(
			id,
			currentWants.patch({
				product: { ...currentWants.product, amount: currentWants.product.amount - 1 },
			}),
		);
	}
}
