import Log, { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";
import { BelongsTo, Client, Level, NPC, OwnedBy, Pathfind, Renderable } from "shared/components";
import promiseR15 from "@rbxts/promise-character";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface _Level {
	model: Renderable;
}

declare const script: { systems: Folder };
export interface ServerState {
	levels: Map<number, _Level>;
}

const state: ServerState = {
	levels: new Map(),
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);

function playerAdded(player: Player) {
	function characterAdded(character: Model) {
		promiseR15(character).andThen((model) => {
			const playerId = world.spawn(
				Renderable({ model }),
				Client({
					player,
					document: {
						coinMultiplier: 1.0,
					},
				}),
			);

			character.SetAttribute("entityId", playerId);
		});
	}

	function giveLevel(character: Model) {
		promiseR15(character).andThen((model) => {
			const levelName = "Level1";
			const levelId = world.spawn(
				Level({
					name: levelName,
				}),
				OwnedBy({
					player,
				}),
			);

			Log.Info("Spawned level {@LevelName} for {@Name}", levelName, player.Name);

			task.delay(1, () => {
				const levelRenderable = world.get(levelId, Renderable);
				if (!levelRenderable) {
					Log.Error("Level {@LevelName} could not be found", levelName);
					return;
				}
				const levelModel = levelRenderable.model as BaseLevel;
				if (levelRenderable && levelRenderable.model) {
					model.PivotTo(levelModel.EmployeeAnchors.Spawn.CFrame.add(new Vector3(0, 5, 0)));
					Log.Info("Teleported {@Name} to {@LevelName}", levelName, player.Name);
				}
				const level = world.get(levelId, Level);

				world.insert(
					levelId,
					NPC({
						name: "Erik",
					}),
					BelongsTo({
						level,
					}),
					Pathfind({
						destination: levelModel.CustomerAnchors.Spawn.Position,
						running: false,
					}),
				);
			});
		});
	}

	if (player.Character) {
		characterAdded(player.Character);
		giveLevel(player.Character);
	}
	player.CharacterAdded.Connect(characterAdded);
	player.CharacterAdded.Connect(giveLevel);
}

Players.PlayerAdded.Connect(playerAdded);
for (const player of Players.GetPlayers()) {
	playerAdded(player);
}
