import {
	BelongsTo,
	Client,
	NPC,
	Product,
	Renderable,
	Wants,
	Level,
	OpenStatus,
	OwnedBy,
	HasUtilities,
} from "shared/components";
import { fetchComponent, getOrError } from "shared/util";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Provider } from "@rbxts/proton";
import { Network } from "shared/network";
import { Balance } from "shared/components";
import { Queue } from "@rbxts/stacks-and-queues";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";
import { store } from "server/data/PlayerData";
import { Players } from "@rbxts/services";
import { New } from "@rbxts/fusion";

interface PlayerData {
	level: number;
	money: number;
	utilityLevels?: Map<string, number>;
}

interface Cosmetics {
	type: "hat" | "uniform";
	xpLevel: number;
	equipped: boolean;
}

interface PlayerSession {
	maid: Maid;
	world: World;
	queue: Queue<Event>;
	player: IPlayer;
}

interface IPlayer {
	player: Player;
	client: Client;
	entity: AnyEntity;
	level?: Level;
}

interface Event {
	type: "newCustomer" | "newEmployee" | "closeStore" | "openStore" | "setLevel";
	args?: {
		level?: number;
		customerName?: CustomerNames;
		employeeName?: EmployeeNames;
	};
	ran: boolean;
}

@Provider()
export class GameProvider {
	/*
      Player Joins -> 
      GameProvider.setup() ->                   <[client]               
      GameProvider.loadPlayerData() ->          >[level, money, utility levels]  
      GameProvider.loadPlayerInventory() ->     >[cosmetics]
    
	  Player Leaves ->
	  GameProvider.saveAndCleanup() ->          <[player]
	  GameProvider.savePlayerData() ->          >[level, money, utility levels]
	  */

	private playerSessions: PlayerSession[] = [];

	saveAndCleanup(player: Player) {
		const session = this.playerSessions.find((session, index) => {
			const matches = session.player.player === player;
			if (matches) {
				this.playerSessions.remove(index);
			}
			return matches;
		});

		if (!session) {
			Log.Error("{@Player} does not have a session, cannot terminate", player.Name);
			return;
		}
		const { client, entity } = session.player;
		session.maid.DoCleaning();
		session.queue.clear();
		this.savePlayerData(session);
	}

	setup(playerEntity: AnyEntity, world: World, state: ServerState, character: Model) {
		const client = getOrError(world, playerEntity, Client, "Client component not found on player entity");
		const balance = getOrError(world, playerEntity, Client, "Balance component not found on player entity");
		const [success, playerData] = this.loadPlayerData(client).await();
		if (!success || !playerData) {
			Log.Fatal("Player data could not be loaded for {@Name}", client.player.Name);
			return;
		}
		Log.Info("Setting up {@Name} with {@PlayerData}", client.player.Name, playerData);
		const playerInventory = this.loadPlayerInventory(client);
		const levelId = this.loadLevel(world, client, playerData.level, character);
		if (!world.contains(levelId)) {
			Log.Error("Level {@LevelId} could not be found", levelId);
			return;
		}
		const level = getOrError(world, levelId, Level, "Level component not found on level entity");

		world.insert(
			playerEntity,
			Balance({
				balance: playerData.money,
			}),
		);
		task.delay(1, () => {
			this.beginGameplayLoop(world, state, client, playerEntity, level, levelId);
		});
	}

	addEvent(player: Player, event: Event) {
		const session = this.playerSessions.find((session) => session.player.player === player);
		if (!session) {
			Log.Error("Player {@Player} does not have a session, cannot send event", player);
			return;
		}
		session.queue.push(event);
	}

	private savePlayerData(session: PlayerSession) {
		const { player } = session.player;
		const dataSession = store.getSession(player as BasePlayer);
		if (dataSession) {
			dataSession.release();
		}
	}

	private beginGameplayLoop(
		world: World,
		state: ServerState,
		client: Client,
		entity: AnyEntity,
		level: Level,
		levelId: AnyEntity,
	) {
		const session: PlayerSession = {
			maid: new Maid(),
			queue: new Queue(),
			world,
			player: {
				player: client.player,
				client,
				entity,
				level,
			},
		};
		this.playerSessions.push(session);
		const { queue, maid } = session;
		const openStore: Event = {
			type: "openStore",
			ran: false,
		};
		queue.push({
			type: "newEmployee",
			ran: false,
		});
		queue.push({
			type: "newEmployee",
			ran: false,
		});
		queue.push(openStore);
		for (let i = 0; i < 5; i++) {
			queue.push({
				type: "newCustomer",
				ran: false,
			});
		}

		const runGameLoop = () => {
			task.wait(level.eventRate);
			const event = queue.pop();
			if (!event) {
				const openStatus = getOrError(
					world,
					levelId,
					OpenStatus,
					"Level does not have OpenStatus component for game tick",
				);
				if (openStatus.open && math.random(0, 100) <= level.spawnRate) {
					queue.push({
						type: math.random(1, 10) < 5 ? "newCustomer" : "newEmployee",
						args: {
							customerName:
								math.random(1, 10) < 5 ? "Erik" : math.random(1, 10) < 5 ? "Kendra" : "Sophia",
						},
						ran: false,
					});
				}
				if (state.verbose) Log.Debug("Running game loop again");
				runGameLoop();
				return;
			}
			const toggleStore = (open: boolean) => {
				if (event.ran) {
					runGameLoop();
					return;
				}
				if (state.verbose) Log.Debug("{@Status} store", open ? "Opening" : "Closing");
				world.insert(
					levelId,
					OpenStatus({
						open,
					}),
				);
				task.spawn(() => {
					Network.setState.server.fire(client.player, { storeStatus: { open } });
				});
				event.ran = true;
			};
			switch (event.type) {
				case "openStore": {
					toggleStore(true);
					break;
				}
				case "closeStore": {
					toggleStore(false);
					break;
				}
				case "newEmployee": {
					if (event.ran) return;
					if (state.verbose) Log.Debug("Spawning new employee");
					const name = event.args?.employeeName ?? "Kenny";
					world.spawn(
						NPC({
							name,
							type: "employee",
						}),
						BelongsTo({
							level: fetchComponent(world, levelId, Level),
							client,
						}),
					);
					event.ran = true;
					break;
				}
				case "newCustomer": {
					if (event.ran) return;
					if (state.verbose) Log.Debug("Spawning new customer");
					const name =
						event.args?.customerName ?? math.random(1, 10) < 5
							? "Erik"
							: math.random(1, 10) < 5
							? "Kendra"
							: "Sophia";
					const hasUtilities = getOrError(
						world,
						levelId,
						HasUtilities,
						"Level does not have HasUtilities component",
					);
					const i = new Random().NextInteger(0, hasUtilities.utilities.size() - 1);
					const product = hasUtilities.utilities[i];
					if (!product) {
						Log.Error("No product found for customer {@CustomerName} index: {@Index}", name, i);
						return;
					}
					const productName = product.model.Makes.Value as keyof Products;

					world.spawn(
						NPC({
							name,
							type: "customer",
						}),
						BelongsTo({
							level: fetchComponent(world, levelId, Level),
							client,
						}),
						Wants({
							product: Product({
								product: productName,
								amount: math.random(1, 3),
							}),
							display: true,
						}),
					);
					event.ran = true;
					break;
				}
				case "setLevel": {
					const { level } = event.args!;
					// TODO: set next level to {@arg level}
					break;
				}
			}
			runGameLoop();
		};

		maid.GiveTask(
			task.spawn(() => {
				runGameLoop();
			}),
		);
	}

	private loadLevel(world: World, client: Client, level: number, character: Model) {
		const levelName = `Level${level}` as keyof Levels;
		const levelId = world.spawn(
			Level({
				name: levelName,
				maxCustomers: 6,
				maxEmployees: 3,
				eventRate: 0.25,
				workRate: 3,
				employeePace: 16,
				spawnRate: 25,
				destinations: [],
				nextAvailableDestination: () => {
					return undefined;
				},
			}),
			OwnedBy({
				player: client.player,
			}),
		);

		Log.Info("Spawned level {@LevelName} for {@Name}", levelName, client.player.Name);

		task.delay(1, () => {
			const levelRenderable = getOrError(world, levelId, Renderable, "Level does not have Renderable component");
			const levelModel = levelRenderable.model as BaseLevel;
			character.PivotTo(levelModel.EmployeeAnchors.Spawn.PrimaryPart!.CFrame.add(new Vector3(0, 5, 0)));
			Log.Info("Teleported {@Name} to {@LevelName}", levelName, client.player.Name);
		});

		return levelId;
	}

	private async loadPlayerData(client: Client) {
		const data = await store.load(client.player as BasePlayer).catch((err) => Log.Warn(err));
		if (!data) {
			Log.Fatal("Failed to load data for {@Name} {@Error}", client.player.Name, data);
			client.player.Kick("Data failed to load");
			return;
		}

		if (!client.player.IsDescendantOf(Players)) {
			data.release();
			return;
		}

		(client.player as BasePlayer).leaderstats.Money.Value = data.data.money;

		return {
			level: 1,
			money: data.data.money,
		};
	}

	private loadPlayerInventory(client: Client) {
		const playerInventory: Cosmetics[] = [
			{
				equipped: true,
				xpLevel: 1,
				type: "hat",
			},
		];

		return playerInventory;
	}
}
