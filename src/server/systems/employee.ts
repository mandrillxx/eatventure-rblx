import {
	BelongsTo,
	Body,
	Customer,
	Destination,
	Employee,
	HasUtilities,
	Holding,
	Level,
	NPC,
	OccupiedBy,
	Pathfind,
	Product,
	Renderable,
	Serving,
	Speech,
	Wants,
} from "shared/components";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { giveItem } from "server/methods";
import Log from "@rbxts/log";

const isEmployeeServingCustomer = (world: World, employee: AnyEntity) => {
	const serving = world.get(employee, Serving);
	if (serving) return true;

	for (const [_id, customer] of world.query(Customer)) {
		if (customer.servedBy === employee) return true;
	}
	return false;
};

const getDestinationByCustomer = (world: World, customer: AnyEntity) => {
	for (const [_id, destination, occupiedBy] of world.query(Destination, OccupiedBy)) {
		if (destination.type === "customer") {
			if (occupiedBy && occupiedBy.entityId === customer) {
				return destination;
			}
		}
	}
	return undefined;
};

function employee(world: World, state: ServerState) {
	const getCustomers = (world: World) => {
		const customers: {
			npcId: AnyEntity;
			npc: NPC;
			npcModel: BaseNPC;
			wants: Wants;
			customer: Customer;
		}[] = [];

		if (state.verbose) Log.Debug("Getting customers");
		for (const [npcId, npc, customer, body, wants] of world.query(NPC, Customer, Body, Wants)) {
			if (!customer.servedBy) {
				if (state.verbose)
					Log.Warn(
						"Customer {@CustomerId} is not being served, checking if they are occupying destination",
						npcId,
					);
				for (const [_id, _destination, occupiedBy] of world.query(Destination, OccupiedBy)) {
					if (occupiedBy.entityId === npcId) {
						customers.push({ npcId, npc, npcModel: body.model as BaseNPC, wants, customer });
						if (state.verbose) Log.Warn("Customer {@CustomerId} is occupying destination", npcId);
						break;
					}
				}
			}
		}

		return customers;
	};

	if (useThrottle(math.random(2, 5))) {
		for (const [id, _npc, _employee, belongsTo] of world
			.query(NPC, Employee, BelongsTo, Body)
			.without(Pathfind, Serving)) {
			if (state.verbose) Log.Info("Employee {@EmployeeId} is looking for customers", id);
			const levelId = belongsTo.level.componentId;
			const levelRenderable = getOrError(
				world,
				levelId,
				Renderable,
				"Level {@LevelId} does not have renderable",
				"error",
				levelId,
			);
			const levelModel = levelRenderable.model as BaseLevel;
			const level = getOrError(
				world,
				levelId,
				Level,
				"Level {@LevelId} does not have a Level component",
				"error",
				levelId,
			);

			const customers = getCustomers(world);
			if (state.verbose) Log.Info("Found {@CustomerCount} customers", customers.size());

			for (const customer of customers) {
				if (!customer.customer.servedBy) {
					const hasUtilities = getOrError(
						world,
						levelId,
						HasUtilities,
						"Level {@LevelId} does not have a HasUtilities component",
						"error",
						levelId,
					);
					const { product } = customer.wants;
					const utility = hasUtilities.utilities.find(
						(x) => (x.model as BaseUtility).Makes.Value === product.product,
					);
					if (!utility) {
						if (state.debug) Log.Debug("No relevant utility found for product {@Product}", product.product);
						continue;
					}

					const utilityDestination =
						utility.model.PrimaryPart!.FindFirstChildWhichIsA("Attachment")!.WorldPosition;
					if (world.get(id, Pathfind)) return;
					if (state.verbose)
						Log.Warn("========================== EMPLOYEE PATHFIND STARTING ==========================");

					if (isEmployeeServingCustomer(world, id)) {
						if (state.verbose)
							Log.Warn("Employee {@EmployeeId} has already started serving another customer", id);
						continue;
					}

					world.insert(customer.npcId, customer.customer.patch({ servedBy: id }));
					world.insert(customer.npcId, customer.wants.patch({ display: false }));

					const timeToTakeOrder = utility.utility.orderDelay / level.workRate;
					const destinationIndex = getDestinationByCustomer(world, customer.npcId)!.instance.Name.sub(-1, -1);
					const destination = (
						levelModel.EmployeeAnchors.FindFirstChild(
							`Destination${destinationIndex}`,
						)! as ComputedAnchorPoint
					).PrimaryPart!.Position;
					world.insert(
						id,
						Pathfind({
							destination,
							running: false,
							finished: () => {
								world.insert(
									id,
									Speech({
										specialType: {
											type: "meter",
											time: timeToTakeOrder,
										},
									}),
								);

								task.delay(timeToTakeOrder, () => {
									world.insert(
										id,
										Pathfind({
											destination: utilityDestination,
											running: false,
											finished: () => {
												world.insert(
													id,
													Speech({
														specialType: {
															type: "meter",
															time: utility.utility.every / level.workRate,
														},
													}),
												);
												task.delay(utility.utility.every / level.workRate, () => {
													world.remove(id, Speech);
													world.insert(
														id,
														Holding({
															product: [
																Product({
																	product: product.product,
																	amount: utility.utility.makes.amount,
																}),
															],
														}),
														Pathfind({
															destination,
															running: false,
															finished: () => {
																world.remove(id, Serving, Speech);
																if (!world.contains(customer.npcId)) return;
																world.insert(
																	customer.npcId,
																	customer.customer.patch({ servedBy: undefined }),
																);
																giveItem({
																	entity: id,
																	world,
																	wants: customer.wants,
																	state,
																	id: customer.npcId,
																});
															},
														}),
													);
												});
											},
										}),
										Serving({
											serving: customer.npc,
											wants: customer.wants,
										}),
									);
								});
							},
						}),
					);

					continue;
				}
			}
		}
	}
}

export = employee;
