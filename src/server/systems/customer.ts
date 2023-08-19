import { BelongsTo, Body, Customer, Destination, NPC, OccupiedBy, Pathfind, Speech, Wants } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { giveItem } from "server/methods";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

const getNextDestination = (world: World, fallbackWait: boolean = true) => {
	let waitDestination: { destinationId: AnyEntity; destination: Destination } | undefined;
	let selectedDestination: { destinationId: AnyEntity; destination: Destination } | undefined;
	for (const [_id, destination] of world.query(Destination).without(OccupiedBy)) {
		if (destination.type !== "customer") continue;
		if (destination.instance.Name === "Wait" && fallbackWait) {
			waitDestination = { destinationId: _id, destination };
		} else {
			selectedDestination = { destinationId: _id, destination };
		}
	}
	return selectedDestination || waitDestination;
};

const moveWaitingCustomer = (world: World) => {
	for (const [_id, _npc, _customer, belongsTo] of world.query(NPC, Customer, BelongsTo).without(Pathfind)) {
		for (const destination of belongsTo.level.destinations) {
			if (destination.destination.type === "customer" && destination.destination.instance.Name !== "Wait") {
				const occupiedBy = world.get(destination.destinationId, OccupiedBy);
				if (occupiedBy && occupiedBy.entityId === _id) {
					return;
				}
			}
		}
		const destination = getNextDestination(world, false);
		if (!destination) {
			Log.Error("No destination found for customer {@CustomerId}", _id);
			continue;
		}
		if (destination.destination.instance.Name !== "Wait")
			world.insert(destination.destinationId, OccupiedBy({ entityId: _id }));
		world.insert(_id, Pathfind({ destination: destination.destination.destination, running: false }));
	}
};

function customer(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	for (const [id, wants] of world.queryChanged(Wants)) {
		if (wants.old && wants.new) {
			if (!world.contains(id)) continue;
			world.insert(id, Speech({ text: `${wants.new.product.amount}x ${wants.new.product.product}` }));
		}
		if (wants.old && !wants.new) {
			if (!world.contains(id)) return;
			const maid = maids.get(id);
			if (maid) {
				maid.DoCleaning();
				maids.delete(id);
			}
			const belongsTo = getOrError(world, id, BelongsTo, "NPC does not have BelongsTo component");

			for (const [_id, destination, occupiedBy] of world.query(Destination, OccupiedBy)) {
				if (destination.instance.Name !== "Wait" && occupiedBy.entityId === id) {
					if (state.verbose)
						Log.Warn(
							"Clear destination {@DestinationName} for customer {@CustomerId}",
							destination.instance.Name,
							id,
						);
					task.delay(2.05, () => {
						world.remove(_id, OccupiedBy);
						moveWaitingCustomer(world);
					});
					break;
				}
			}
			world.remove(id, Pathfind);
			world.insert(id, Speech({ text: "Thanks!" }));
			if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(belongsTo.client.player))
				state.playerStatisticsProvider.recordEvent(belongsTo.client.player, "customersServed", 1);
			task.delay(2, () => world.despawn(id));
		}
		if (!wants.old && wants.new) {
			maids.set(id, new Maid());

			const chosenDestination = getNextDestination(world);
			if (!chosenDestination) {
				Log.Error("aaaahhhhhh No destination found for customer {@CustomerId}", id);
				continue;
			}
			if (chosenDestination.destination.instance.Name !== "Wait")
				world.insert(chosenDestination.destinationId, OccupiedBy({ entityId: id }));
			world.insert(id, Pathfind({ destination: chosenDestination.destination.destination, running: false }));
			task.delay(1, () => {
				if (!world.contains(id)) return;
				const body = getOrError(world, id, Body, "Entity has Wants component but does not have Body component");
				const bodyModel = body.model as BaseNPC;

				const maid = maids.get(id)!;

				maid.GiveTask(
					bodyModel.ClickDetector.MouseClick.Connect((player) => {
						giveItem({
							player,
							world,
							maid,
							id,
							wants: wants.new!,
							state,
						});
					}),
				);
				world.insert(id, Speech({ text: `${wants.new!.product.amount}x ${wants.new!.product.product}` }));
			});
		}
	}
}

export = customer;
