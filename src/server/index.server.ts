import {
	DataStorePlayerStatisticsPersistenceLayer,
	IPlayerStatisticsProvider,
	PlayerStatisticsProvider,
	StatisticsDefinition,
	EventsDefinition,
} from "@rbxts/player-statistics";
import { DataStoreService, PhysicsService, Players, ReplicatedStorage } from "@rbxts/services";
import { PlayerStatisticEventsDefinition, PlayerStatisticsDefinition } from "./data/PlayerStatisticsDefinition";
import { BelongsTo, Client, Renderable, Upgrade } from "shared/components";
import { GameProvider } from "./providers/game";
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
import { IProfile, setupPurchases } from "./data/PurchaseHandler";
import { getOrError } from "shared/util";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface _Level {
	model: Renderable;
	levelId: AnyEntity;
}

declare const script: { systems: Folder };
export interface ServerState {
	levels: Map<number, _Level>;
	clients: Map<number, AnyEntity>;
	profiles: Map<Player, Profile<IProfile, unknown>>;
	playerStatisticsProvider: IPlayerStatisticsProvider<StatisticsDefinition, EventsDefinition<StatisticsDefinition>>;
	playerIndex: number;
	debug: boolean;
	verbose: boolean;
}

const ProfileTemplate: IProfile = {
	level: 1,
	money: 0,
	gems: 5,
	logInTimes: 0,
	purchasedUpgrades: new Set(),
	utilityLevels: new Map(),
};

const state: ServerState = {
	levels: new Map(),
	clients: new Map(),
	profiles: new Map(),
	playerStatisticsProvider: undefined as unknown as IPlayerStatisticsProvider<
		StatisticsDefinition,
		EventsDefinition<StatisticsDefinition>
	>,
	playerIndex: 0,
	debug: true,
	verbose: false,
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const gameProvider = Proton.get(GameProvider);

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
}

function collision() {
	PhysicsService.RegisterCollisionGroup("NPCs");
	PhysicsService.CollisionGroupSetCollidable("NPCs", "NPCs", false);
	PhysicsService.CollisionGroupSetCollidable("NPCs", "Default", true);
}

async function bootstrap() {
	function playerRemoving(player: Player) {
		state.clients.delete(player.UserId);
		const profile = state.profiles.get(player);
		if (profile) {
			profile.Release();
		}
		gameProvider.saveAndCleanup(player);
	}

	function playerAdded(player: Player) {
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
			promiseR15(character).andThen(async (model) => {
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
			New("NumberValue")({
				Value: 0,
				Name: "Money",
				Parent: leaderstats,
			});
			const utilityInfo = ReplicatedStorage.Assets.UtilityInfo.Clone();
			const upgradeInfo = ReplicatedStorage.Assets.UpgradeInfo.Clone();
			utilityInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
			upgradeInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
		});

		handleData();
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

	Network.setStoreStatus.server.connect((player, open) => {
		gameProvider.addEvent(player, {
			type: open ? "openStore" : "closeStore",
			ran: false,
		});
	});

	Network.purchaseUpgrade.server.connect((player, upgradeId) => {
		Log.Info("Player {@Player} is purchasing upgrade {@UpgradeId}", player, upgradeId);
		if (!world.contains(upgradeId)) {
			return Log.Warn(
				"Player {@Player} is purchasing upgrade {@UpgradeId} which does not exist",
				player,
				upgradeId,
			);
		}
		const upgrade = getOrError(world, upgradeId, Upgrade);
		const belongsTo = getOrError(world, upgradeId, BelongsTo);
		Log.Info(
			"Player {@Player} is purchasing upgrade {@Upgrade} which belongs to {@PlayerId}",
			player,
			upgrade,
			belongsTo.playerId,
		);
	});

	Network.retrieveStatistics.server.handle((player) => {
		const snapshot = state.playerStatisticsProvider.getStatisticsSnapshotForPlayer(player);
		return snapshot;
	});
}

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
