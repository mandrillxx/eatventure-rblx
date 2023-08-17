<<<<<<< HEAD
import Log, { Logger } from "@rbxts/log";
import { DataStoreService, PhysicsService, Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Client, Renderable, Wants } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import { Proton } from "@rbxts/proton";
import { GameProvider } from "./providers/game";
import { Balance } from "shared/components";
import { Network } from "shared/network";
=======
>>>>>>> 4429656 (add: gui state)
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

const state: ServerState = {
	levels: new Map(),
	clients: new Map(),
	playerStatisticsProvider: undefined as unknown as IPlayerStatisticsProvider<
		StatisticsDefinition,
		EventsDefinition<StatisticsDefinition>
	>,
	debug: true,
	verbose: false,
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
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
					Renderable({ model }),
					Balance({
						balance: 35.2,
					}),
					Client({
						player,
						document: {
							coinMultiplier: 1.0,
						},
					}),
				);

				state.clients.set(player.UserId, playerEntity);
				gameProvider.setup(playerEntity, world, state, model);
				character.SetAttribute("entityId", playerEntity);
			});
		}

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
