import {
	HasUtilities,
	Renderable,
	OpenStatus,
	BelongsTo,
	OwnedBy,
	Product,
	Client,
	Level,
	Wants,
	NPC,
	Utility,
	Employee,
} from "shared/components";
import { NPCDisplayNames, getOrError, randomNpcName, weightedRandomIndex } from "shared/util";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ServerState } from "server/index.server";
import { Provider } from "@rbxts/proton";
import { IProfile } from "server/data/PurchaseHandler";
import { Profile } from "@rbxts/profileservice/globals";
import { Network } from "shared/network";
import { Balance } from "shared/components";
import { Queue } from "@rbxts/stacks-and-queues";
import { Foods } from "shared/globals";
import { New } from "@rbxts/fusion";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

interface PlayerData {
	level: number;
	money: number;
	profile: Profile<IProfile, unknown>;
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
	profile: Profile<IProfile, unknown>;
	player: IPlayer;
}

interface IPlayer {
	player: Player;
	client: Client;
	entity: AnyEntity;
	levelId: AnyEntity;
}

interface Event {
	type: "newCustomer" | "newEmployee" | "closeStore" | "openStore" | "setLevel" | "resetEmployees";
	args?: {
		level?: number;
		npc?: NPCDisplayNames;
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

	private cleanup(world: World, state: ServerState, levelId: AnyEntity, session: PlayerSession) {
		session.queue.clear();
		session.maid.DoCleaning();

		function getPlayerPlot(player: Player) {
			for (const plot of state.plots) {
				if (plot[1].playerUserId === player.UserId) {
					return plot[1];
				}
			}
		}

		const playersPlot = getPlayerPlot(session.player.player);
		if (playersPlot) {
			state.plots.set(playersPlot.position, {
				playerId: undefined,
				playerUserId: undefined,
				levelId: undefined,
				position: playersPlot.position,
			});
		} else Log.Fatal("2 Could not find plot for player {@Player}, cannot clear", session.player.player);

		if (world.contains(levelId)) world.despawn(levelId);
	}

	private getPlayerSession(player: Player) {
		return this.playerSessions.find((session, index) => {
			const matches = session.player.player === player;
			if (matches) {
				this.playerSessions.remove(index);
			}
			return matches;
		});
	}

	switchLevel(player: Player, state: ServerState, level: number, skipMoney: boolean = false) {
		const session = this.getPlayerSession(player);

		if (!session) {
			Log.Error("{@Player} does not have a session, cannot switch levels", player.Name);
			return;
		}

		const { world } = session;
		const { entity, levelId } = session.player;
		this.cleanup(world, state, levelId, session);

		const newLevelId = this.loadLevel(
			world,
			session.profile,
			session.player.entity,
			session.player.client,
			level,
			player.Character || player.CharacterAdded.Wait()[0],
		);
		if (!world.contains(newLevelId)) {
			Log.Error("Level {@LevelId} could not be found", newLevelId);
			return;
		}

		const playerData = this.loadPlayerData(session.player.client, state);
		if (!playerData) {
			Log.Fatal("Player data could not be loaded for {@Name}", session.player.player.Name);
			return;
		}
		if (!skipMoney) {
			world.insert(
				entity,
				Balance({
					balance: playerData.money,
				}),
			);
		}

		const newLevel = getOrError(world, newLevelId, Level, "Level component not found on new level entity");
		task.delay(1, () => {
			this.beginGameplayLoop(
				world,
				playerData.profile,
				state,
				session.player.client,
				entity,
				newLevel,
				newLevelId,
			);
		});
	}

	saveAndCleanup(player: Player, state: ServerState) {
		const session = this.getPlayerSession(player);

		if (!session) {
			Log.Error("{@Player} does not have a session, cannot terminate", player.Name);
			return;
		}
		const { world } = session;
		const { entity, levelId } = session.player;
		this.cleanup(world, state, levelId, session);

		if (world.contains(entity)) world.despawn(entity);
		this.savePlayerData(session);
	}

	setup(playerEntity: AnyEntity, world: World, state: ServerState, character: Model) {
		const client = getOrError(world, playerEntity, Client, "Client component not found on player entity");
		const playerData = this.loadPlayerData(client, state);
		if (!playerData) {
			Log.Fatal("Player data could not be loaded for {@Name}", client.player.Name);
			return;
		}
		const playerInventory = this.loadPlayerInventory(client);
		const levelId = this.loadLevel(world, playerData.profile, playerEntity, client, playerData.level, character);
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
			this.beginGameplayLoop(world, playerData.profile, state, client, playerEntity, level, levelId);
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
	}

	private beginGameplayLoop(
		world: World,
		profile: Profile<IProfile, unknown>,
		state: ServerState,
		client: Client,
		entity: AnyEntity,
		level: Level,
		levelId: AnyEntity,
	) {
		const session: PlayerSession = {
			maid: new Maid(),
			queue: new Queue(),
			profile,
			world,
			player: {
				player: client.player,
				client,
				entity,
				levelId,
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
							npc: randomNpcName(math.random(0, 10) < 5 ? "Male" : "Female"),
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
				if (!world.contains(levelId)) return;
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
				case "resetEmployees": {
					for (const [id, _employee] of world.query(Employee)) {
						world.despawn(id);
					}
					break;
				}
				case "newEmployee": {
					if (!world.contains(levelId) || event.ran) return;
					if (state.verbose) Log.Debug("Spawning new employee");
					const gender = math.random(0, 10) < 5 ? "Male" : "Female";
					const name = event.args?.npc ?? randomNpcName(gender);
					world.spawn(
						NPC({
							name,
							gender,
							type: "employee",
						}),
						BelongsTo({
							levelId,
							playerId: entity,
						}),
					);
					event.ran = true;
					break;
				}
				case "newCustomer": {
					if (event.ran) return;
					if (state.verbose) Log.Debug("Spawning new customer");
					const gender = math.random(0, 10) < 5 ? "Male" : "Female";
					const name = event.args?.npc ?? randomNpcName(gender);
					if (!world.contains(levelId)) return;
					const hasUtilities = getOrError(
						world,
						levelId,
						HasUtilities,
						"Level does not have HasUtilities component",
					);
					const utilities: Utility[] = [];
					for (const _utility of hasUtilities.utilities) {
						const utility = getOrError(world, _utility.utility.componentId, Utility);
						utilities.push(utility);
					}
					const filtered = utilities.filter((util) => util.unlocked);
					const utilityName = weightedRandomIndex(filtered);
					if (state.verbose)
						Log.Warn("Chose utility {@UtilityName} for customer {@CustomerName}", utilityName, name);
					if (!utilityName) {
						Log.Error("No utility for product found for customer {@CustomerName}", name);
						return;
					}
					const levelRenderable = getOrError(
						world,
						levelId,
						Renderable,
						"Level does not have Renderable component",
					).model as BaseLevel;
					const model = levelRenderable.Utilities.FindFirstChild(utilityName) as BaseUtility;
					const productName = model.Makes.Value as Foods;

					world.spawn(
						NPC({
							name,
							gender,
							type: "customer",
						}),
						BelongsTo({
							levelId,
							playerId: entity,
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

	private loadLevel(
		world: World,
		profile: Profile<IProfile, unknown>,
		playerId: AnyEntity,
		client: Client,
		level: number,
		character: Model,
	) {
		const levelName = `Level${level}` as keyof Levels;
		const prestigeCost = (ReplicatedStorage.Assets.Levels.FindFirstChild(levelName)! as BaseLevel).Settings
			.PrestigeCost.Value;
		const levelId = world.spawn(
			Level({
				name: levelName,
				displayName: profile.Data.levelName,
				prestigeCost,
				maxCustomers: 2,
				maxEmployees: 1,
				eventRate: 1,
				workRate: 1,
				employeePace: 13,
				spawnRate: 25,
				destinations: [],
				nextAvailableDestination: () => {
					return undefined;
				},
			}),
			OwnedBy({
				player: client.player,
				playerId,
			}),
		);

		task.delay(1, () => {
			const levelRenderable = getOrError(world, levelId, Renderable, "Level does not have Renderable component");
			const levelModel = levelRenderable.model as BaseLevel;
			character.PivotTo(
				levelModel.EmployeeAnchors.Spawn.PrimaryPart!.CFrame.add(
					new Vector3(math.random(1, 3), 3, math.random(1, 3)),
				),
			);
			Log.Info("Teleported {@Name} to {@LevelName}", levelName, client.player.Name);
		});

		return levelId;
	}

	private loadPlayerData(client: Client, state: ServerState): PlayerData | undefined {
		const player = client.player as BasePlayer;
		const profile = state.profiles.get(player);
		if (!profile) {
			Log.Warn("No profile found for {@Name}", player.Name);
			return;
		}
		if (state.verbose) Log.Info("Loaded profile for {@Name}: {@Profile}", player.Name, profile.Data);

		if (!player.IsDescendantOf(Players)) {
			Log.Debug("{@Name} is not a descendant of Players, releasing data", player.Name);
			profile.Release();
			return;
		}
		player.leaderstats.Money.Value = FormatCompact(profile.Data.money, profile.Data.money > 100_000 ? 0 : 2);
		player.Money.Value = profile.Data.money;

		profile.Data.utilityLevels.forEach((level, utility) => {
			if (player.Utilities.FindFirstChild(utility)) return;
			New("IntValue")({
				Name: utility,
				Value: level,
				Parent: player.Utilities,
			});
		});
		if (state.verbose) Log.Warn("Loaded data for {@Name}", player.Name);

		return {
			profile,
			level: profile.Data.level,
			money: profile.Data.money,
			utilityLevels: profile.Data.utilityLevels,
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
