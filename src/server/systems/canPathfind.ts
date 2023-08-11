import { World } from "@rbxts/matter";
import { Body, NPC, Pathfind } from "shared/components";
import Simplepath from "@rbxts/simplepath";
import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";
import Log from "@rbxts/log";

function CanPathfind(world: World, _: ServerState, ui: Widgets) {
	for (const [id, pathfind] of world.queryChanged(Pathfind)) {
		Log.Debug("Pathfind {@id} has changed {@Old} {@New}", id, pathfind.old, pathfind.new);
		if (!pathfind.new) {
			Log.Debug("Pathfind {@id} has no new state", id);
			return;
		}
		const proceed =
			!pathfind.new.running &&
			pathfind.old !== undefined &&
			!pathfind.old.running &&
			pathfind.new.destination !== undefined;
		Log.Debug(
			"{@NewNotRunning} && {@OldIsDefined} && {@OldNotRunning} && {@OldDestinationNotSet} && {@NewDestinationSet}",
			!pathfind.new.running,
			pathfind.old !== undefined,
			!pathfind.old?.running,
			!pathfind.old?.destination,
			pathfind.new.destination !== undefined,
		);
		Log.Debug("Pathfind {@id} should proceed: {@proceed}", id, proceed);
		if (proceed) {
			Log.Info("NPC {@id} has a new destination", id);
			const body = world.get(id, Body);
			if (!body) {
				Log.Warn("NPC {@id} has no body", id);
				return;
			}
			const destination = pathfind.new.destination;
			const newState = pathfind.new.patch({ running: true });
			const finishedState = pathfind.new.patch({ destination: undefined, running: false });
			task.spawn(() => {
				const path = new Simplepath(body.model);
				world.insert(id, newState);
				path.Run(destination!);
				path.Reached.Connect(() => {
					Log.Info("NPC {@id} reached destination", id);
					world.insert(id, finishedState);
				});
			});
		}
	}

	// for (const [id, npc, body, pathfind] of world.query(NPC, Body, Pathfind)) {
	// 	if (pathfind.destination && !pathfind.running) {
	// 		const destination = pathfind.destination;
	// 		task.spawn(() => {
	// 			const path = new Simplepath(body.model);
	// 			world.insert(id, pathfind.patch({ running: true }));
	// 			path.Run(destination);
	// 			path.Reached.Connect(() => {
	// 				Log.Info("NPC {@id} reached destination", id);
	// 				world.insert(id, pathfind.patch({ destination: undefined, running: false }));
	// 			});
	// 		});
	// 	}
	// }
}

export = CanPathfind;
