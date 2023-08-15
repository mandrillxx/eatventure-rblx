import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { AnyEntity, World } from "@rbxts/matter";
import { Provider } from "@rbxts/proton";
import { Queue } from "@rbxts/stacks-and-queues";
import { t } from "@rbxts/t";
import { BelongsTo, Client, NPC, Pathfind, Product, Renderable, Wants } from "shared/components";
import { Balance } from "shared/components/game";
import { Level, OpenStatus, OwnedBy } from "shared/components/level";

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
		level: number;
	};
	ran: boolean;
}

@Provider()
export class GameProvider {
	/*
      Player Joins -> 
      GameProvider.setup() ->                   <[client]               
      GameProvider.loadPlayerData() ->          >[level, money, utility levels, ]  
      GameProvider.loadPlayerInventory() ->     >[cosmetics]
     */

	private playerSessions: PlayerSession[] = [];

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

	private beginGameplayLoop(world: World, client: Client, entity: AnyEntity, level: Level, levelId: AnyEntity) {
		const session: PlayerSession = {
			maid: new Maid(),
			player: {
				player: client.player,
				client,
				entity,
				level,
			},
		};
		this.playerSessions.push(session);
		const queue: Queue<Event> = new Queue();
		const openStore: Event = {
			type: "openStore",
			ran: false,
		};
		const newCustomer: Event = {
			type: "newCustomer",
			ran: false,
		};
		queue.push(openStore);
		queue.push(newCustomer);
		queue.push({
			type: "setLevel",
			args: {
				level: 4,
			},
			ran: false,
		});

		const runGameLoop = () => {
			task.wait(1);
			const event = queue.pop();
			if (!event) {
				Log.Debug("No event for this cycle");
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
					world.spawn(
						NPC({
							name: "Erik",
						}),
						BelongsTo({
							level,
						}),
						Pathfind({
							destination,
							running: false,
						}),
						Wants({
							product: Product({
								product: "Coffee",
								amount: 1,
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
			Log.Debug("Running loop again");
			runGameLoop();
		};

		session.maid.GiveTask(
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
