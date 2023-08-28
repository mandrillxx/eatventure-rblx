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
	Client,
} from "shared/components";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ComponentInfo, getOrError } from "shared/util";
import { ServerState } from "server/index.server";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

const getNextDestination = (world: World, player: AnyEntity, fallbackWait: boolean = true) => {
	let waitDestination: ComponentInfo<typeof Destination> | undefined;
	let selectedDestination: ComponentInfo<typeof Destination> | undefined;
	for (const [_id, destination] of world.query(Destination).without(OccupiedBy)) {
		if (destination.type !== "customer") continue;
		const belongsTo = getOrError(world, _id, BelongsTo, "Destination does not have BelongsTo component");
		if (belongsTo.playerId !== player) continue;
		if (destination.instance.Name === "Wait" && fallbackWait) {
			waitDestination = { componentId: _id, component: destination } as ComponentInfo<typeof Destination>;
		} else if (destination.instance.Name !== "Wait" && !selectedDestination) {
			selectedDestination = { componentId: _id, component: destination } as ComponentInfo<typeof Destination>;
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
	return false;
};

const moveCustomer = (world: World, customer: AnyEntity, destination: ComponentInfo<typeof Destination>) => {
	if (destination.component.instance.Name !== "Wait")
		world.insert(destination.componentId, OccupiedBy({ entityId: customer }));
	world.insert(
		customer,
		Pathfind({
			destination: destination.component.destination,
			running: false,
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

function customer(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	if (useThrottle(1)) {
		for (const [id, _customer, belongsTo] of world.query(Customer, BelongsTo)) {
			const destination = getNextDestination(world, belongsTo.playerId, false);
			const isOccupying = isCustomerOccupying(world, belongsTo.levelId, id);
			if (destination?.component.instance.Name === "Wait") Log.Warn("Somethign went wrnnnnn =============-");
			if (isOccupying || !destination) continue;
			moveCustomer(world, id, destination);
		}
	}

	for (const [id, wants] of world.queryChanged(Wants)) {
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
				world.insert(id, Speech({ text: `x${wants.new!.product.amount}` }));
			});
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
						if (world.contains(_id)) world.remove(_id, OccupiedBy);
					});
					continue;
				}
			}

			world.insert(id, Speech({ text: ":)" }));
			const client = getOrError(world, belongsTo.playerId, Client, "Player does not have Client component");
			if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(client.player))
				state.playerStatisticsProvider.recordEvent(client.player, "customersServed", 1);
			task.delay(2, () => {
				if (world.contains(id)) world.despawn(id);
			});
		}
		if (wants.old && wants.new) {
			if (!world.contains(id)) continue;
			world.insert(id, Speech({ text: `x${wants.new.product.amount}` }));
		}
	}
}

export = customer;
