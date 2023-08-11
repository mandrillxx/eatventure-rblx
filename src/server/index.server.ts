import Log, { Logger } from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Client, NPC, Renderable, Zone } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import Debug from "./providers/debug";
import { Network } from "shared/network";

declare const script: { systems: Folder };
export interface ServerState {}

const state: ServerState = {};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);

world.spawn(Zone({ maxCapacity: 5, population: 0 }));

function playerAdded(player: Player) {
	function characterAdded(character: Model) {
		promiseR15(character).andThen((model) => {
			const playerId = world.spawn(
				Renderable({ model }),
				Client({
					player,
					document: {
						rewardsMultiplier: 1,
					},
				}),
			);

			character.SetAttribute("entityId", playerId);
		});
	}

	if (player.Character) characterAdded(player.Character);
	player.CharacterAdded.Connect(characterAdded);
}

Players.PlayerAdded.Connect(playerAdded);
for (const player of Players.GetPlayers()) {
	playerAdded(player);
}

Proton.awaitStart();

const debug = Proton.get(Debug);
debug.setWorld(world);

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

Network.summonCustomer.server.connect((player, name) => {
	debug.summonCustomer(name);
});
