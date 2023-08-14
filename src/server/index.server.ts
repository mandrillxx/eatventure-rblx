import Log, { Logger } from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Animate, Body, Client, NPC, Pathfind, Renderable, Transform } from "shared/components";
import promiseR15 from "@rbxts/promise-character";
import { Network } from "shared/network";
import { Level } from "shared/components/level";
import { World } from "@rbxts/matter";

declare const script: { systems: Folder };
export interface ServerState {
	levels: Map<keyof Levels, WorldInfo>;
}

const state: ServerState = {
	levels: new Map(),
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
world.spawn(
	Level({
		name: "Level1",
		npcs: [],
		products: [],
	}),
);

function playerAdded(player: Player) {
	function characterAdded(character: Model) {
		promiseR15(character).andThen((model) => {
			const currentLevel: WorldInfo = state.levels.get("Level1")!;
			const playerId = world.spawn(
				Renderable({ model }),
				Client({
					player,
					currentLevel,
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

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());
