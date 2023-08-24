import {
	Destination,
	OccupiedBy,
	BelongsTo,
	Customer,
	Pathfind,
	Speech,
	Level,
	Wants,
	Body,
	NPC,
	Client,
} from "shared/components";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ComponentInfo, getOrError } from "shared/util";
import { ServerState } from "server/index.server";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

const moveCustomerIfOpen = (world: World, player: AnyEntity, customer: AnyEntity) => {
	const isCloserDestinationAvailable = getNextDestination(world, player, false);
	if (isCloserDestinationAvailable && isCloserDestinationAvailable.component.instance.Name !== "Wait") {
		moveCustomer(world, customer, isCloserDestinationAvailable);
	}
};

const getNextDestination = (world: World, player: AnyEntity, fallbackWait: boolean = true) => {
	let waitDestination: ComponentInfo<typeof Destination> | undefined;
	let selectedDestination: ComponentInfo<typeof Destination> | undefined;
	for (const [_id, destination] of world.query(Destination).without(OccupiedBy)) {
		if (destination.type !== "customer") continue;
		const belongsTo = getOrError(world, _id, BelongsTo, "Destination does not have BelongsTo component");
		if (belongsTo.playerId !== player) continue;
		if (destination.instance.Name === "Wait" && fallbackWait) {
			waitDestination = { componentId: _id, component: destination };
		} else {
			selectedDestination = { componentId: _id, component: destination };
		}
	}
	return selectedDestination ?? waitDestination;
};

const isCustomerOccupying = (world: World, levelId: AnyEntity, customer: AnyEntity) => {
	const level = getOrError(world, levelId, Level, "Level does not have Level component");
	const destinations = level.destinations;
	for (const dest of destinations) {
		if (dest.component.type === "customer" && dest.component.instance.Name !== "Wait") {
			const occupiedBy = world.get(dest.componentId, OccupiedBy);
			if (occupiedBy && occupiedBy.entityId === customer) {
				return dest;
			}
		}
	}
	return undefined;
};

const moveCustomer = (world: World, customer: AnyEntity, destination: ComponentInfo<typeof Destination>) => {
	if (destination.component.instance.Name !== "Wait") {
		for (const [_id, _destination, occupiedBy] of world.query(Destination, OccupiedBy)) {
			if (occupiedBy.entityId === customer) {
				return;
			}
		}
		world.insert(destination.componentId, OccupiedBy({ entityId: customer }));
	}
	world.insert(
		customer,
		Pathfind({
			destination: destination.component.destination,
			running: false,
			cf: true,
			finished: () => {
				const body = getOrError(
					world,
					customer,
					Body,
					"Entity has Wants component but does not have Body component",
				).model as BaseNPC;
				if (destination.component.instance.Name !== "Wait") body.DialogGui.DialogFrame.Visible = true;
			},
		}),
	);
};

const moveWaitingCustomer = (world: World) => {
	for (const [id, _npc, _customer, belongsTo] of world.query(NPC, Customer, BelongsTo).without(Pathfind)) {
		if (isCustomerOccupying(world, belongsTo.levelId, id)) {
			continue;
		}
		const destination = getNextDestination(world, belongsTo.playerId, false);
		if (!destination) {
			Log.Error("No destination found for customer {@CustomerId}", id);
			continue;
		}
		moveCustomer(world, id, destination);
	}
};

function customer(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	if (useThrottle(1)) {
		for (const [id, _customer] of world.query(Customer).without(Pathfind)) {
			const belongsTo = getOrError(world, id, BelongsTo, "NPC does not have BelongsTo component");
			moveCustomerIfOpen(world, belongsTo.playerId, id);
		}
	}

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
			world.remove(id, Pathfind);

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
					continue;
				}
			}

			world.insert(id, Speech({ text: "Thanks!" }));
			const client = getOrError(world, belongsTo.playerId, Client, "Player does not have Client component");
			if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(client.player))
				state.playerStatisticsProvider.recordEvent(client.player, "customersServed", 1);
			task.delay(2, () => world.despawn(id));
		}
		if (!wants.old && wants.new) {
			maids.set(id, new Maid());

			const belongsTo = getOrError(world, id, BelongsTo, "NPC does not have BelongsTo component");
			const chosenDestination = getNextDestination(world, belongsTo.playerId);
			if (!chosenDestination) {
				Log.Warn("No available destination found for customer {@CustomerId}", id);
				continue;
			}
			if (chosenDestination.component.instance.Name !== "Wait")
				world.insert(chosenDestination.componentId, OccupiedBy({ entityId: id }));
			world.insert(
				id,
				Pathfind({
					destination: chosenDestination.component.destination,
					cf: true,
					running: false,
					finished: () => {
						if (chosenDestination.component.instance.Name === "Wait") return;
						const body = getOrError(
							world,
							id,
							Body,
							"Entity has Wants component but does not have Body component",
						).model as BaseNPC;
						body.DialogGui.DialogFrame.Visible = true;
					},
				}),
			);
			task.delay(1, () => {
				if (!world.contains(id)) return;
				world.insert(id, Speech({ text: `${wants.new!.product.amount}x ${wants.new!.product.product}` }));
			});
		}
	}
}

export = customer;
