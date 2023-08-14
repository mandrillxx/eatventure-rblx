import { World } from "@rbxts/matter";
import { Body, NPC, Pathfind } from "shared/components";
import Simplepath from "@rbxts/simplepath";
import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";

function pathfind(world: World, _: ServerState, ui: Widgets) {
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
						Log.Warn("Pathfind {@id} failed to pathfind", id);
						return;
					}

					function endPath() {
						maid.DoCleaning();
						world.remove(id, Pathfind);
						path.Destroy();
					}

					maid.GiveTask(
						path.Error.Connect((errorType) => {
							Log.Error("Pathfind {@id} has errored: {@Error}", id, errorType);
							endPath();
						}),
					);

					maid.GiveTask(
						path.Blocked.Connect(() => {
							Log.Error("Pathfind {@id} is blocked", id);
							endPath();
						}),
					);

					maid.GiveTask(
						path.Reached.Connect(() => {
							Log.Info("Pathfind {@id} has reached its destination", id);
							endPath();
						}),
					);

					maid.GiveTask(
						task.delay(watchdogAmount, () => {
							Log.Error("Pathfind {@id} has timed out after {@Seconds}s", id, watchdogAmount);
							endPath();
						}),
					);
				}),
			);
		}
	}
}

export = pathfind;
