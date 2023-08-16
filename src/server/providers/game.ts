import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { AnyEntity, World } from "@rbxts/matter";
import { Provider } from "@rbxts/proton";
import { ReplicatedStorage } from "@rbxts/services";
import { Queue } from "@rbxts/stacks-and-queues";
import DataStore from "@rbxts/suphi-datastore";
import { t } from "@rbxts/t";
import { BelongsTo, Client, NPC, Pathfind, Product, Renderable, Wants } from "shared/components";
import { Balance } from "shared/components";
import { Level, OpenStatus, OwnedBy } from "shared/components/level";
import { Network } from "shared/network";

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
	type: "newCustomer" | "closeStore" | "openStore" | "setLevel";
	args?: {
		level?: number;
		customerName?: NPCNames;
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

	setup(playerEntity: AnyEntity, world: World, character: Model) {
		const client = world.get(playerEntity, Client);
		if (!client) {
			Log.Error("Client component not found on player entity");
			return;
		}
		const balance = world.get(playerEntity, Balance);
		if (!balance) {
			Log.Error("Balance component not found on player entity");
			return;
		}
		const playerData = this.loadPlayerData(client);
		const playerInventory = this.loadPlayerInventory(client);
		const levelId = this.loadLevel(world, client, playerData.level, character);
		if (!world.contains(levelId)) {
			Log.Error("Level {@LevelId} could not be found", levelId);
			return;
		}
		const level = world.get(levelId, Level);

		world.insert(
			playerEntity,
			Balance({
				balance: playerData.money,
			}),
		);
		this.beginGameplayLoop(world, client, playerEntity, level, levelId);
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
		const { player, client, entity } = session.player;
		const { world } = session;
		// const dataStore = DataStore.find<PlayerData>("playerData", tostring(player.UserId));
		// dataStore?.Destroy();
		const balance = world.get(entity, Balance);
		if (!balance) {
			Log.Error("Balance component not found for {@PlayerName}, cannot save data", player.Name);
			return;
		}
		Log.Debug("Saving data for {@PlayerName} with {@Balance} coins", player.Name, balance.balance);
	}

	private beginGameplayLoop(world: World, client: Client, entity: AnyEntity, level: Level, levelId: AnyEntity) {
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
		const newCustomer: Event = {
			type: "newCustomer",
			ran: false,
		};
		queue.push(newCustomer);
		queue.push(openStore);

		const runGameLoop = () => {
			task.wait(1);
			const event = queue.pop();
			if (!event) {
				const openStatus = world.get(levelId, OpenStatus);
				if (openStatus && openStatus.open) {
					queue.push({
						type: "newCustomer",
						args: {
							customerName:
								math.random(1, 10) < 5
									? "Erik"
									: math.random(1, 10) < 5
									? "Kendra"
									: math.random(1, 10) < 5
									? "Sophia"
									: "Kenny",
						},
						ran: false,
					});
				}
				Log.Debug("Running game loop again");
				runGameLoop();
				return;
			}
			const toggleStore = (open: boolean) => {
				if (event.ran) {
					runGameLoop();
					return;
				}
				Log.Debug("{@Status} store", open ? "Opening" : "Closing");
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
				case "newCustomer": {
					if (event.ran) return;
					Log.Debug("Spawning new customer");
					const levelModel = world.get(levelId, Renderable)!.model as BaseLevel;
					const destination = levelModel.CustomerAnchors.Destination1.Position;
					const name = event.args?.customerName ?? "Erik";
					world.spawn(
						NPC({
							name,
							type: name === "Erik" ? "customer" : "employee",
						}),
						BelongsTo({
							level,
							client,
						}),
						Pathfind({
							destination,
							running: false,
						}),
						Wants({
							product: Product({
								product:
									math.random(0, 100) <= 51 ? "Bagel" : math.random(0, 100) <= 51 ? "Coffee" : "Tea",
								amount: math.random(1, 3),
							}),
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
				maxCustomers: 5,
				maxEmployees: 2,
				spawnRate: 1.0,
			}),
			OwnedBy({
				player: client.player,
			}),
		);

		Log.Info("Spawned level {@LevelName} for {@Name}", levelName, client.player.Name);

		task.delay(1, () => {
			const levelRenderable = world.get(levelId, Renderable);
			if (!levelRenderable || !levelRenderable.model) {
				Log.Error("Level {@LevelName} could not be found", levelName);
				return;
			}
			const levelModel = levelRenderable.model as BaseLevel;
			character.PivotTo(levelModel.EmployeeAnchors.Spawn.CFrame.add(new Vector3(0, 5, 0)));
			Log.Info("Teleported {@Name} to {@LevelName}", levelName, client.player.Name);
		});

		return levelId;
	}

	private loadPlayerData(client: Client) {
		const playerData: PlayerData = {
			level: 1,
			money: 1000,
		};

		// const dataStore = new DataStore<PlayerData>("playerData", tostring(client.player.UserId));
		// const [success, data] = dataStore.Open(playerData);
		// if (success !== "Success") {
		// 	Log.Error("Could not load player data for {@Name} {@Return} {@Data}", client.player.Name, success, data);
		// }
		return playerData;
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