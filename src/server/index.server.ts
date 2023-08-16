import Log, { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Client, Renderable } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import { Proton } from "@rbxts/proton";
import { GameProvider } from "./providers/game";
import { Balance } from "shared/components";
import { Network } from "shared/network";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface _Level {
	model: Renderable;
}

declare const script: { systems: Folder };
export interface ServerState {
	levels: Map<number, _Level>;
	debug: boolean;
}

const state: ServerState = {
	levels: new Map(),
	debug: true,
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const gameProvider = Proton.get(GameProvider);

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

			gameProvider.setup(playerEntity, world, model);
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

Network.setStoreStatus.server.connect((player, open) => {
	gameProvider.addEvent(player, {
		type: open ? "openStore" : "closeStore",
		ran: false,
	});
});
