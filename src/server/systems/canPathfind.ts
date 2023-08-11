import { World } from "@rbxts/matter";
import { Body, NPC, Pathfind } from "shared/components";
import Simplepath from "@rbxts/simplepath";
import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";

function CanPathfind(world: World, _: ServerState, ui: Widgets) {
	for (const [id, pathfind] of world.queryChanged(Pathfind)) {
		if (!pathfind.old && pathfind.new && pathfind.new.destination && !pathfind.new.running) {
			Log.Debug("Pathfind {@id} is moving to {@Destination}", id, pathfind.new.destination);
			world.insert(id, pathfind.new.patch({ running: true }));
			const body = world.get(id, Body);
			if (!body) {
				Log.Warn("NPC {@id} has no body", id);
				continue;
			}
			const destination = pathfind.new.destination;
			const watchdogAmount = 10;
			const maid = new Maid();

			maid.GiveTask(
				task.spawn(() => {
					const path = new Simplepath(body.model);
					path.Visualize = true;
					const isPathfinding = path.Run(destination);
					if (!isPathfinding) {
						Log.Debug("Pathfind {@id} failed to pathfind", id);
						return;
					}

					maid.GiveTask(
						path.Blocked.Connect(() => {
							Log.Debug("Pathfind {@id} is blocked", id);
							maid.DoCleaning();
							world.remove(id, Pathfind);
						}),
					);

					maid.GiveTask(
						path.Reached.Connect(() => {
							Log.Debug("Pathfind {@id} has reached its destination", id);
							maid.DoCleaning();
							world.remove(id, Pathfind);
						}),
					);

					maid.GiveTask(
						task.delay(watchdogAmount, () => {
							Log.Debug("Pathfind {@id} has timed out after {@Seconds}s", id, watchdogAmount);
							maid.DoCleaning();
							world.remove(id, Pathfind);
						}),
					);
				}),
			);
		}
	}
}

export = CanPathfind;
