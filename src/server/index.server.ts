import {
	DataStorePlayerStatisticsPersistenceLayer,
	IPlayerStatisticsProvider,
	PlayerStatisticsProvider,
	StatisticsDefinition,
	EventsDefinition,
} from "@rbxts/player-statistics";
import { DataStoreService, PhysicsService, Players, ReplicatedStorage } from "@rbxts/services";
import { PlayerStatisticEventsDefinition, PlayerStatisticsDefinition } from "./data/PlayerStatisticsDefinition";
import { Client, Renderable } from "shared/components";
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
import promiseR15 from "@rbxts/promise-character";
import ProfileService from "@rbxts/profileservice";

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

interface IProfile {
	level: number;
	money: number;
	logInTimes: number;
	utilityLevels: Map<string, number>;
}
const ProfileTemplate: IProfile = {
	level: 1,
	money: 0,
	logInTimes: 0,
	utilityLevels: new Map<string, number>(),
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
				state.playerIndex++;
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
			utilityInfo.Parent = player.FindFirstChildOfClass("PlayerGui")!;
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

	Network.setStoreStatus.server.connect((player, open) => {
		gameProvider.addEvent(player, {
			type: open ? "openStore" : "closeStore",
			ran: false,
		});
	});

	Network.retrieveStatistics.server.handle((player) => {
		const snapshot = state.playerStatisticsProvider.getStatisticsSnapshotForPlayer(player);
		return snapshot;
	});
}

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
