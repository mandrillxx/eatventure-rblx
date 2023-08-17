<<<<<<< HEAD
import Log from "@rbxts/log";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ServerState } from "server/index.server";
=======
>>>>>>> 4429656 (add: gui state)
import {
	BelongsTo,
	Body,
	Customer,
	Employee,
	HasUtilities,
	NPC,
	Pathfind,
	Renderable,
	Serving,
	Wants,
} from "shared/components";
<<<<<<< HEAD
import { makes } from "shared/components/level";
=======
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { makes } from "shared/components/level";
import Log from "@rbxts/log";
>>>>>>> 4429656 (add: gui state)

function employee(world: World, state: ServerState) {
	if (useThrottle(math.random(2, 5))) {
		for (const [id, npc, employee, belongsTo] of world.query(NPC, Employee, BelongsTo).without(Pathfind, Serving)) {
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
								Log.Warn("========================== PATHFIND STARTING ==========================");
							if (world.get(id, Pathfind)) return;
							world.insert(customer.npcId, customer.customer.patch({ servedBy: id }));
<<<<<<< HEAD
=======
							world.insert(customer.npcId, customer.wants.patch({ display: false }));
>>>>>>> 4429656 (add: gui state)
							world.insert(
								id,
								Pathfind({
									destination,
									running: false,
									finished: () => {
										task.delay(
											math.random(
												3 * customer.wants.product.amount,
												4 * customer.wants.product.amount,
											),
											() => {
												world.insert(
													id,
													Pathfind({
														destination: (levelModel.model as BaseLevel).EmployeeAnchors
															.Destination1.Position,
														running: false,
														finished: () => {
															world.remove(id, Serving);
															if (!world.contains(customer.npcId)) return;
															world.insert(
																customer.npcId,
																customer.customer.patch({ servedBy: undefined }),
															);
															world.remove(customer.npcId, Wants);
														},
													}),
												);
											},
										);
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
