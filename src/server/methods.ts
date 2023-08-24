import { Balance, BelongsTo, Client, Holding, Utility, Wants } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
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
	utilityId: AnyEntity;
}

export function giveItem({ player, entity, world, maid, id, wants, state, utilityId }: GiveItem) {
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
		: state.clients.get(getOrError(world, getOrError(world, entity!, BelongsTo).playerId, Client).player.UserId)!;
	const client = getOrError(world, benefitingPlayer, Client);
	const balance = getOrError(world, benefitingPlayer, Balance);
	const utility = getOrError(world, utilityId, Utility);
	const reward = utility.reward * (1.2 ** utility.xpLevel - 1) * 5 * 0.2 * client.document.coinMultiplier;
	let rewardMultiplier = 1;
	if (utility.xpLevel >= 25 && utility.xpLevel < 50) rewardMultiplier *= 1.5;
	if (utility.xpLevel >= 50 && utility.xpLevel < 100) rewardMultiplier *= 2;
	if (utility.xpLevel >= 100) rewardMultiplier *= 3;
	if (state.verbose)
		Log.Info(
			"Reward: {@Reward}x{@RewardMulti} {@RewardBase} ** {@UtilityXPLevel} * {@CoinMultiplier}",
			reward,
			rewardMultiplier,
			utility.reward,
			utility.xpLevel,
			client.document.coinMultiplier,
		);
	if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(client.player))
		state.playerStatisticsProvider.recordEvent(client.player, "moneyEarned", reward * rewardMultiplier);
	world.insert(benefitingPlayer, balance.patch({ balance: balance.balance + reward * rewardMultiplier }));
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
