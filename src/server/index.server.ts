import {
	DataStorePlayerStatisticsPersistenceLayer,
	EventsDefinition,
	IPlayerStatisticsProvider,
	PlayerStatisticsProvider,
	StatisticsDefinition,
} from "@rbxts/player-statistics";
import { DataStoreService, PhysicsService, Players, ReplicatedStorage } from "@rbxts/services";
import { PlayerStatisticEventsDefinition, PlayerStatisticsDefinition } from "./data/PlayerStatisticsDefinition";
import { Client, Renderable } from "shared/components";
import { GameProvider } from "./providers/game";
import { AnyEntity } from "@rbxts/matter";
import { setupTags } from "shared/setupTags";
import { Network } from "shared/network";
import { Balance } from "shared/components";
import { Proton } from "@rbxts/proton";
import { start } from "shared/start";
import Log, { Logger } from "@rbxts/log";
import promiseR15 from "@rbxts/promise-character";
import { New } from "@rbxts/fusion";

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
	playerStatisticsProvider: IPlayerStatisticsProvider<StatisticsDefinition, EventsDefinition<StatisticsDefinition>>;
	debug: boolean;
	verbose: boolean;
}

export const state: ServerState = {
	levels: new Map(),
	clients: new Map(),
	playerStatisticsProvider: undefined as unknown as IPlayerStatisticsProvider<
		StatisticsDefinition,
		EventsDefinition<StatisticsDefinition>
	>,
	debug: false,
	verbose: false,
};

export const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const gameProvider = Proton.get(GameProvider);

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

function bootstrap() {
	function playerRemoving(player: Player) {
		state.clients.delete(player.UserId);
		gameProvider.saveAndCleanup(player);
	}

	function playerAdded(player: Player) {
		function characterAdded(character: Model) {
			promiseR15(character).andThen((model) => {
				const playerEntity = world.spawn(
					Client({
						player,
						document: {
							coinMultiplier: 10.0,
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

			New("NumberValue")({
				Value: 0,
				Name: "Money",
				Parent: leaderstats,
			});
		});

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

bootstrap();
