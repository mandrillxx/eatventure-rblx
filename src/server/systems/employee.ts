import {
	BelongsTo,
	Body,
	Customer,
	Employee,
	HasUtilities,
	Holding,
	NPC,
	Pathfind,
	Product,
	Renderable,
	Serving,
	Speech,
	Wants,
} from "shared/components";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { makes } from "shared/components/level";
import Log from "@rbxts/log";
import { giveItem } from "server/components/methods";

function employee(world: World, state: ServerState) {
	if (useThrottle(math.random(2, 5))) {
		for (const [id, _npc, _employee, belongsTo] of world
			.query(NPC, Employee, BelongsTo)
			.without(Pathfind, Serving)) {
			const levelId = state.levels.get(belongsTo.client.player.UserId)!.levelId;

			const customers: {
				npcId: AnyEntity;
				npc: NPC;
				npcModel: BaseNPC;
				wants: Wants;
				customer: Customer;
			}[] = [];
			for (const [_id, _npc, customer, body, wants, _belongsTo] of world
				.query(NPC, Customer, Body, Wants, BelongsTo)
				.without(Pathfind)) {
				if (!customer.servedBy)
					customers.push({ npcId: _id, npc: _npc, npcModel: body.model as BaseNPC, wants, customer });
			}
			for (const customer of customers) {
				if (!customer.customer.servedBy) {
					const { product } = customer.wants;
					const utility = makes.find((x) => x.makes === product.product);
					if (!utility) {
						if (state.debug) Log.Debug("No relevant utility found for product {@Product}", product.product);
						continue;
					}
					const levelModel = world.get(levelId, Renderable)!;
					const hasUtilites = world.get(levelId, HasUtilities);
					if (!hasUtilites) {
						Log.Error("Level {@LevelId} does not have a HasUtilities component", levelId);
						continue;
					}
					const { utilities } = hasUtilites;
					for (const _utility of utilities) {
						if (_utility.model.Name === utility.utilityName) {
							const destination =
								_utility.model.PrimaryPart!.FindFirstChildWhichIsA("Attachment")!.WorldPosition;
							if (state.verbose)
								Log.Warn(
									"========================== EMPLOYEE PATHFIND STARTING ==========================",
								);
							if (world.get(id, Pathfind)) return;
							world.insert(customer.npcId, customer.customer.patch({ servedBy: id }));
							world.insert(customer.npcId, customer.wants.patch({ display: false }));
							world.insert(
								id,
								Speech({
									text: `Serving ${customer.npc.name} ${_utility.utility.makes.amount}x ${_utility.utility.makes.product}`,
								}),
							);
							world.insert(
								id,
								Pathfind({
									destination,
									running: false,
									finished: () => {
										task.delay(_utility.utility.every, () => {
											world.insert(
												id,
												Holding({
													product: [
														Product({
															product: product.product,
															amount: _utility.utility.makes.amount,
														}),
													],
												}),
												Speech({
													text: `Delivering ${_utility.utility.makes.amount}x ${_utility.utility.makes.product} to ${customer.npc.name}`,
												}),
												Pathfind({
													destination: (levelModel.model as BaseLevel).EmployeeAnchors
														.Destination1.Position,
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
	}
}

export = employee;
