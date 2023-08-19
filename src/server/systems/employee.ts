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

function employee(world: World, state: ServerState) {
	const getCustomers = () => {
		const customers: {
			npcId: AnyEntity;
			npc: NPC;
			npcModel: BaseNPC;
			wants: Wants;
			customer: Customer;
		}[] = [];

		for (const [id, _npc, customer, body, wants, _belongsTo] of world
			.query(NPC, Customer, Body, Wants, BelongsTo)
			.without(Pathfind)) {
			if (!customer.servedBy) {
				let isOccupying = false;
				for (const [_id, _destination, occupiedBy] of world.query(Destination, OccupiedBy)) {
					if (occupiedBy.entityId === id) {
						isOccupying = true;
						break;
					}
				}
				if (isOccupying)
					customers.push({ npcId: id, npc: _npc, npcModel: body.model as BaseNPC, wants, customer });
			}
		}

		return customers;
	};

	if (useThrottle(math.random(2, 5))) {
		for (const [id, _npc, _employee, belongsTo] of world
			.query(NPC, Employee, BelongsTo, Body)
			.without(Pathfind, Serving)) {
			const levelId = belongsTo.levelId;
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

			const customers = getCustomers()!;

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

					const destination = utility.model.PrimaryPart!.FindFirstChildWhichIsA("Attachment")!.WorldPosition;
					if (world.get(id, Pathfind)) return;
					if (state.verbose)
						Log.Warn("========================== EMPLOYEE PATHFIND STARTING ==========================");

					world.insert(customer.npcId, customer.customer.patch({ servedBy: id }));
					world.insert(customer.npcId, customer.wants.patch({ display: false }));

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
											time: utility.utility.every / level.workRate,
										},
									}),
								);
								task.delay(utility.utility.every / level.workRate, () => {
									world.remove(id, Speech);
									const destination = (
										levelModel.EmployeeAnchors.FindFirstChild(
											`Destination${"1"}`,
										)! as ComputedAnchorPoint
									).PrimaryPart!.Position;
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
					continue;
				}
			}
		}
	}
}

export = employee;
