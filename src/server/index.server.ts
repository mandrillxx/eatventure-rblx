import {
	DataStorePlayerStatisticsPersistenceLayer,
	IPlayerStatisticsProvider,
	PlayerStatisticsProvider,
	StatisticsDefinition,
	EventsDefinition,
} from "@rbxts/player-statistics";
import {
	IPlayerStatisticAchievementsManager,
	PlayerStatisticAchievementsManager,
} from "@rbxts/player-statistic-achievements";
import { served10Customers, served1000Customers, earned100k, earned10m, maxedUtility } from "./data/BadgeHandler";
import { DataStoreService, PhysicsService, Players, ReplicatedStorage, TextService } from "@rbxts/services";
import { PlayerStatisticEventsDefinition, PlayerStatisticsDefinition } from "./data/PlayerStatisticsDefinition";
import { BadgeRewardGranter, RecurringTimeLockedRewardContainer } from "@rbxts/reward-containers";
import { getLevelUtilityAmount, getPlayerMaxedUtilities } from "shared/methods";
import { Client, Level, Renderable, SoundEffect } from "shared/components";
import { PlayerStatisticAchievementsDefinition } from "./data/BadgeHandler";
import { IProfile, setupPurchases } from "./data/PurchaseHandler";
import { GameProvider } from "./providers/game";
import { getOrError } from "shared/util";
import { AnyEntity } from "@rbxts/matter";
import { setupTags } from "shared/setupTags";
import { Profile } from "@rbxts/profileservice/globals";
import { Network } from "shared/network";
import { Balance } from "shared/components";
import { Proton } from "@rbxts/proton";
import { start } from "shared/start";
import { New } from "@rbxts/fusion";
import Log, { Logger } from "@rbxts/log";
import ProfileService from "@rbxts/profileservice";
import promiseR15 from "@rbxts/promise-character";
import { RewardProvider } from "./providers/container";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface _Level {
	model: Renderable;
	levelId: AnyEntity;
}

interface Plot {
	playerId: AnyEntity | undefined;
	playerUserId: number | undefined;
	levelId: AnyEntity | undefined;
	position: 1 | 2 | 3 | 4;
}

declare const script: { systems: Folder };
export interface ServerState {
	nextOpenPlot: () => Plot | undefined;
	plots: Map<1 | 2 | 3 | 4, Plot>;
	levels: Map<number, _Level>;
	clients: Map<number, AnyEntity>;
	rewardContainers: Map<number, RecurringTimeLockedRewardContainer>;
	profiles: Map<Player, Profile<IProfile, unknown>>;
	playerStatisticsProvider: IPlayerStatisticsProvider<StatisticsDefinition, EventsDefinition<StatisticsDefinition>>;
	playerAchievementsManager: IPlayerStatisticAchievementsManager<
		StatisticsDefinition,
		{
			served10Customers: typeof served10Customers;
			served1000Customers: typeof served1000Customers;
			earned100k: typeof earned100k;
			earned10m: typeof earned10m;
			maxedUtility: typeof maxedUtility;
		}
	>;
	playerIndex: number;
	debug: boolean;
	verbose: boolean;
}

const ProfileTemplate: IProfile = {
	level: 1,
	levelName: "Cafe",
	money: 0,
	gems: 5,
	logInTimes: 0,
	codesRedeemed: new Set(),
	purchasedUpgrades: new Set(),
	purchasedUtilities: new Set<string>().add("Microwave").add("CarrotStation"),
	utilityLevels: new Map(),
};

const state: ServerState = {
	plots: new Map(),
	nextOpenPlot: () => {
		return undefined;
	},
	levels: new Map(),
	clients: new Map(),
	profiles: new Map(),
	rewardContainers: new Map(),
	playerStatisticsProvider: undefined as unknown as IPlayerStatisticsProvider<
		StatisticsDefinition,
		EventsDefinition<StatisticsDefinition>
	>,
	playerAchievementsManager: undefined as unknown as PlayerStatisticAchievementsManager<
		typeof PlayerStatisticsDefinition,
		typeof PlayerStatisticAchievementsDefinition
	>,
	playerIndex: 0,
	debug: false,
	verbose: false,
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const gameProvider = Proton.get(GameProvider);
const container = Proton.get(RewardProvider);

const GameProfileStore = ProfileService.GetProfileStore("PlayerData", ProfileTemplate);

function statistics() {
	const playerStatisticsDataStore = DataStoreService.GetDataStore("PlayerStatistics");
	const playerStatisticsPersistenceLayer =
		DataStorePlayerStatisticsPersistenceLayer.create(playerStatisticsDataStore);
	state.playerStatisticsProvider = PlayerStatisticsProvider.create(
		PlayerStatisticEventsDefinition,
		playerStatisticsPersistenceLayer,
		PlayerStatisticsDefinition,
	);

	const rewardGrantersByRewardType = new Map([["Badge", BadgeRewardGranter.create()]]);
	const playerStatisticAchievementsManager = PlayerStatisticAchievementsManager.create(
		PlayerStatisticAchievementsDefinition,
		rewardGrantersByRewardType,
		state.playerStatisticsProvider,
	);
	state.playerAchievementsManager = playerStatisticAchievementsManager;
}

function collision() {
	PhysicsService.RegisterCollisionGroup("NPCs");
	PhysicsService.CollisionGroupSetCollidable("NPCs", "NPCs", false);
	PhysicsService.CollisionGroupSetCollidable("NPCs", "Default", true);
}

async function bootstrap() {
	function playerRemoving(player: Player) {
		function getPlayerPlot(player: Player) {
			for (const plot of state.plots) {
				if (plot[1].playerUserId === player.UserId) {
					return plot[1];
				}
			}
		}
		const playersPlot = getPlayerPlot(player);
		if (!playersPlot && state.verbose) {
			Log.Warn("Could not find plot for player {@Player}, cannot clear", player);
		} else if (playersPlot) {
			state.plots.set(playersPlot.position, {
				playerId: undefined,
				playerUserId: undefined,
				levelId: undefined,
				position: playersPlot.position,
			});
		}

		state.clients.delete(player.UserId);
		const profile = state.profiles.get(player);
		if (profile) {
			state.profiles.delete(player);
			profile.Release();
		}
		state.rewardContainers.delete(player.UserId);
		gameProvider.saveAndCleanup(player, state);
	}

	for (let i = 1; i < 5; i++) {
		const _i = i as 1 | 2 | 3 | 4;
		state.plots.set(_i, {
			playerUserId: undefined,
			playerId: undefined,
			levelId: undefined,
			position: _i,
		});
	}
	state.nextOpenPlot = () => {
		for (const plot of state.plots) {
			if (!plot[1].levelId && !plot[1].playerId) {
				return plot[1];
			}
		}
	};

	function playerAdded(player: Player) {
		function handleGui(playerId: AnyEntity) {
			const overlay = player.FindFirstChildOfClass("PlayerGui")!.WaitForChild("Overlay") as NewOverlayGui;
			const renovate = overlay.Renovate;
			const restaurant = overlay.Restaurant;
			restaurant.Content.Body.ResetEmployees.MouseButton1Click.Connect(() => {
				// gameProvider.addEvent(player, {
				// 	type: "resetEmployees",
				// 	ran: false,
				// });
			});
			renovate.Content.Footer.Purchase.MouseButton1Click.Connect(() => {
				Log.Info("Player {@Player} is purchasing level", player);
				const levelId = state.levels.get(player.UserId);
				if (!levelId) {
					Log.Warn("Could not find level for player {@Player}", player);
					return;
				}
				const playerMaxedUtilities = getPlayerMaxedUtilities(world, playerId, levelId.levelId);
				const levelUtilities = getLevelUtilityAmount(world, levelId.levelId);
				if (playerMaxedUtilities < levelUtilities) {
					Log.Warn(
						"Player {@Player} tried to prestige while only havnig {@Maxed}/{Maxed2}",
						player.Name,
						playerMaxedUtilities,
						levelUtilities,
					);
					return;
				}
				const balance = getOrError(world, playerId, Balance);
				const level = getOrError(world, levelId.levelId, Level);
				if (balance.balance >= level.prestigeCost) {
					Log.Info("Prestiging player {@Player}", player.Name);
					world.insert(playerId, Balance({ balance: 0 }));
					const profile = state.profiles.get(player)!;
					profile.Data.level += 1;
					gameProvider.switchLevel(player, state, 2, true);
					task.delay(0.3, () => ((player as BasePlayer).leaderstats.Money.Value = "0"));
				} else Log.Info("Player {@Player} cannot afford level", player);
			});
		}

		function handleRewards() {
			const rewardsOpeningCoordinator = container.coordinator;

			const rewardContainerForPlayer = RecurringTimeLockedRewardContainer.create(
				"DailyRewardContainer",
				3 * 60 * 60,
				player,
				rewardsOpeningCoordinator,
			);
			state.rewardContainers.set(player.UserId, rewardContainerForPlayer);
		}

		function handleData() {
			const profile = GameProfileStore.LoadProfileAsync("Player_" + player.UserId);
			if (!profile) {
				return player.Kick("Failed to load profile");
			}
			profile.AddUserId(player.UserId);
			profile.Reconcile();
			profile.ListenToRelease(() => {
				state.profiles.delete(player);
				player.Kick("Session was terminated");
			});
			if (player.IsDescendantOf(Players)) {
				return state.profiles.set(player, profile);
			}
			return profile.Release();
		}

		function characterAdded(character: Model) {
			promiseR15(character)
				.andThen(async (model) => {
					const playerEntity = world.spawn(
						Client({
							player,
							document: {
								coinMultiplier: 1.0,
							},
						}),
						Balance({
							balance: 0,
						}),
						Renderable({ model }),
					);
					state.clients.set(player.UserId, playerEntity);
					gameProvider.setup(playerEntity, world, state, model);
					character.SetAttribute("entityId", playerEntity);
					handleGui(playerEntity);
				})
				.catch(() => {
					player.Kick("Failed to load character data");
				});
		}

		task.spawn(() => {
			const leaderstats = New("Folder")({
				Name: "leaderstats",
				Parent: player,
			});
			New("Folder")({
				Name: "Utilities",
				Parent: player,
			});
			New("StringValue")({
				Value: "0",
				Name: "Money",
				Parent: leaderstats,
			});
			New("NumberValue")({
				Value: 0,
				Name: "Money",
				Parent: player,
			});
			const utilityInfo = ReplicatedStorage.Assets.UtilityInfo.Clone();
			const unlockInfo = ReplicatedStorage.Assets.UnlockGui.Clone();
			const upgradeInfo = ReplicatedStorage.Assets.UpgradeInfo.Clone();
			utilityInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
			unlockInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
			upgradeInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
		});

		handleData();
		handleRewards();

		if (player.Character) characterAdded(player.Character);
		player.CharacterAdded.Connect(characterAdded);
	}

	Players.PlayerAdded.Connect(playerAdded);
	Players.PlayerRemoving.Connect(playerRemoving);
	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}

	statistics();
	collision();
	setupPurchases(state, world);

	Network.redeemCode.server.handle((player, code) => {
		const redeem = (amount: number) => {
			const playerId = state.clients.get(player.UserId);
			if (!playerId) {
				world.spawn(SoundEffect({ sound: "Fail", meantFor: player }));
				Log.Warn("Could not find player for player {@Player}, cannot redeem code", player);
				return "fail";
			}
			const profile = state.profiles.get(player);
			if (!profile) {
				world.spawn(SoundEffect({ sound: "Fail", meantFor: player }));
				Log.Warn("Could not find profile for player {@Player}, cannot redeem code", player);
				return "fail";
			}
			if (profile.Data.codesRedeemed.has(code)) {
				world.spawn(SoundEffect({ sound: "Fail", meantFor: player }));
				return "used";
			}
			const balance = getOrError(
				world,
				playerId,
				Balance,
				"Could not find balance for player while redeeming code",
			);
			world.insert(playerId, balance.patch({ balance: balance.balance + amount }));
			world.spawn(SoundEffect({ sound: "CodeRedeem", meantFor: player }));
			profile.Data.codesRedeemed.add(code);
		};

		if (code === "RELEASE") {
			redeem(1_000);
			return "success";
		} else if (code === "BETA") {
			redeem(25_000);
			return "success";
		} else if (code === "DEV") {
			redeem(100_000);
			return "success";
		} else if (code === "TIKTOK") {
			redeem(5_000);
			return "success";
		}
		world.spawn(SoundEffect({ sound: "Fail", meantFor: player }));
		return "fail";
	});

	Network.setStoreStatus.server.connect((player, open) => {
		gameProvider.addEvent(player, {
			type: open ? "openStore" : "closeStore",
			ran: false,
		});
	});

	Network.setStoreName.server.connect((player, name) => {
		if (name.size() < 3) {
			if (state.verbose)
				Log.Warn("Player {@Player} tried to set store name to {@Name} but it is too short", player, name);
			return;
		}
		const levelId = state.levels.get(player.UserId);
		if (!levelId) {
			Log.Warn("Could not find level for player {@Player}", player);
			return;
		}
		const level = getOrError(world, levelId.levelId, Level);
		const profile = state.profiles.get(player)!;
		const filteredName = TextService.FilterStringAsync(name, player.UserId).GetNonChatStringForBroadcastAsync();
		world.insert(levelId.levelId, level.patch({ displayName: filteredName }));
		profile.Data.levelName = filteredName;
	});

	Network.retrieveStatistics.server.handle((player) => {
		const snapshot = state.playerStatisticsProvider.getStatisticsSnapshotForPlayer(player);
		return snapshot;
	});
}

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
