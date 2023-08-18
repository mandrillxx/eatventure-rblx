import {
	BelongsTo,
	Body,
	Customer,
	Employee,
	HasUtilities,
	Holding,
	Level,
	NPC,
	Pathfind,
	Product,
	Renderable,
	Serving,
	Speech,
	Utility,
	Wants,
} from "shared/components";
import { AnyEntity, World, useThrottle } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { makes } from "shared/components/level";
import Log from "@rbxts/log";
import { giveItem } from "server/components/methods";

function employee(world: World, state: ServerState) {
	for (const [id, employee] of world.queryChanged(Employee)) {
		if (employee.new) {
			const body = world.get(id, Body)!;
			const level = world.get(id, BelongsTo)!.level;
			Log.Warn("Employee {@ID} has joined, setting walkspeed to {@Walkspeed}", id, level.employeePace);
			body.model.Humanoid.WalkSpeed = level.employeePace;
		}
	}

	const getCustomers = () => {
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

		return customers;
	};

	const getUtilityByName = (utilities: HasUtilities, utilityName: string) => {
		for (const utility of utilities.utilities) {
			if (utility.model.Name === utilityName) {
				return utility;
			}
		}
	};

	if (useThrottle(math.random(2, 5))) {
		for (const [id, _npc, _employee, belongsTo] of world
			.query(NPC, Employee, BelongsTo)
			.without(Pathfind, Serving)) {
			const levelId = belongsTo.levelId;
			const levelModel = world.get(levelId, Renderable)!.model as BaseLevel;
			const level = world.get(levelId, Level)!;

			const customers = getCustomers();

			for (const customer of customers) {
				// Find first customer who isn't being served
				if (!customer.customer.servedBy) {
					const { product } = customer.wants;
					const utilityInfo = makes.find((x) => x.makes === product.product);
					if (!utilityInfo) {
						if (state.debug) Log.Debug("No relevant utility found for product {@Product}", product.product);
						continue;
					}
					const hasUtilites = world.get(levelId, HasUtilities);
					if (!hasUtilites) {
						Log.Error("Level {@LevelId} does not have a HasUtilities component", levelId);
						continue;
					}
					const utility = getUtilityByName(hasUtilites, utilityInfo.utilityName);
					if (!utility) {
						Log.Error("Utility {@UtilityName} does not exist in level", utilityInfo.utilityName);
						continue;
					}

					const destination = utility.model.PrimaryPart!.FindFirstChildWhichIsA("Attachment")!.WorldPosition;
					if (state.verbose)
						Log.Warn("========================== EMPLOYEE PATHFIND STARTING ==========================");

					if (world.get(id, Pathfind)) return;
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
											`Destination${math.random(
												1,
												levelModel.EmployeeAnchors.GetChildren().size() - 1,
											)}`,
										)! as BasePart
									).Position;
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
