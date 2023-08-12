import Log, { Logger } from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { Animate, Body, Client, NPC, Pathfind, Renderable, Transform, Zone } from "shared/components";
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
					currentLevel: undefined,
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
	const npc = debug.summonCustomer(name);
	world.insert(npc);
});

Network.hireEmployee.server.connect((player, name) => {
	const npc = debug.hireEmployee(name);
	const path = world.get(npc, Pathfind);
	if (!path) {
		Log.Debug("No pathfind component found for {@id}", npc);
		return;
	}
	task.delay(2, () => {
		world.insert(npc, path.patch({ destination: Workspace.Levels.Level1.CustomerAnchors.Destination1.Position }));
	});
});

Network.moveEmployee.server.connect((player, employee) => {
	for (const [id, _npc, _transform] of world.query(NPC, Transform)) {
		const level = Workspace.Levels.FindFirstChild("Level1")! as Level;
		world.insert(
			id,
			Pathfind({
				destination: level.EmployeeAnchors.Spawn.Position,
				running: false,
			}),
		);
	}
});

Network.emoteEmployee.server.connect((player, name, emote) => {
	for (const [id, _npc, body] of world.query(NPC, Body)) {
		world.insert(
			id,
			Animate({
				animationType: emote,
			}),
		);
	}
});
