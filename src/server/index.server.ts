import Log, { Logger } from "@rbxts/log";
import { DataStoreService, Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Client, Renderable, Wants } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import { Proton } from "@rbxts/proton";
import { GameProvider } from "./providers/game";
import { Balance } from "shared/components";
import { Network } from "shared/network";
import {
	DataStorePlayerStatisticsPersistenceLayer,
	EventsDefinition,
	IPlayerStatisticsProvider,
	PlayerStatisticsProvider,
	StatisticsDefinition,
} from "@rbxts/player-statistics";
import { PlayerStatisticEventsDefinition, PlayerStatisticsDefinition } from "./data/PlayerStatisticsDefinition";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface _Level {
	model: Renderable;
}

declare const script: { systems: Folder };
export interface ServerState {
	levels: Map<number, _Level>;
	playerStatisticsProvider: IPlayerStatisticsProvider<StatisticsDefinition, EventsDefinition<StatisticsDefinition>>;
	debug: boolean;
	verbose: boolean;
}

const state: ServerState = {
	levels: new Map(),
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

function bootstrap() {
	function playerRemoving(player: Player) {
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

	Network.provide.server.connect((player, id) => {
		const wants = world.get(id, Wants);
		if (!wants) {
			Log.Error("Player {@PlayerName} tried to provide for {@ID} but it doesn't exist", player.Name, id);
			return;
		}
		if (wants.product.amount === 1) {
			if (state.verbose) Log.Info("NPC {@NPC} got what they wanted", id);
			world.remove(id, Wants);
		} else {
			if (state.verbose) Log.Info("NPC {@NPC} got what they wanted, but still wants more", id);
			world.insert(
				id,
				wants.patch({
					product: { ...wants.product, amount: wants.product.amount - 1 },
				}),
			);
		}
		const snapshot = state.playerStatisticsProvider.getStatisticsSnapshotForPlayer(player);
		if (state.verbose) Log.Warn("================ customersServed {@CustomersServed}", snapshot.customersServed);
		state.playerStatisticsProvider.recordEvent(player, "customersServed", 1);
	});
}

bootstrap();
