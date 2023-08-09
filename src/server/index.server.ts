import Log, { Logger } from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import trackLineSight from "./trackLineSight";
import { Client, Renderable, Zone } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import { setPartCollisionGroup } from "shared/setCharacterCollisionGroup";
import { setupPhysicsCollisionRemove } from "./physicsGroupCollide";

declare const script: { systems: Folder };
export interface ServerState {}

const state: ServerState = {};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags, trackLineSight);

world.spawn(Zone({ maxCapacity: 5, population: 0 }));

function playerAdded(player: Player) {
	function characterAdded(character: Model) {
		promiseR15(character).andThen((model) => {
			const playerId = world.spawn(
				Renderable({ model }),
				Client({
					player,
					lineSight: Vector3.zero,
					document: {
						rewardsMultiplier: 1,
					},
				}),
			);

			character.SetAttribute("entityId", playerId);

			setPartCollisionGroup(character, "Agency");
		});
	}

	if (player.Character) characterAdded(player.Character);
	player.CharacterAdded.Connect(characterAdded);
}

Players.PlayerAdded.Connect(playerAdded);
for (const player of Players.GetPlayers()) {
	playerAdded(player);
}

setupPhysicsCollisionRemove();

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());
