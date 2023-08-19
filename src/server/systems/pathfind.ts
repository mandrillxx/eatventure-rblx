import { Body, Pathfind } from "shared/components";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { World } from "@rbxts/matter";
import Simplepath from "@rbxts/simplepath";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

function pathfind(world: World, state: ServerState) {
	for (const [id, pathfind] of world.queryChanged(Pathfind)) {
		if (!pathfind.old && pathfind.new && pathfind.new.destination && !pathfind.new.running) {
			if (!world.contains(id)) continue;
			if (state.verbose) Log.Debug("Pathfind {@id} is moving to {@Destination}", id, pathfind.new.destination);
			world.insert(id, pathfind.new.patch({ running: true }));
			const body = getOrError(world, id, Body, "Entity has pathfind component without a Body component");
			const destination = pathfind.new.destination;
			const watchdogAmount = 10;
			const maid = new Maid();

			const attemptPathfind = () => {
				const path = new Simplepath(body.model);
				path.Visualize = state.debug;

				const isPathfinding = path.Run(destination);
				if (!isPathfinding) {
					Log.Warn(
						"Pathfind {@id} failed to pathfind to {@Destination} {@Error}",
						id,
						`${string.format("%.2f", destination.X)}, ${string.format("%.2f", destination.Z)}`,
						path.LastError,
					);
					attemptPathfind();
					return;
				}

				function endPath(retry: boolean = false) {
					maid.DoCleaning();
					path.Destroy();
					if (retry) {
						task.spawn(attemptPathfind);
						return;
					}
					if (!world.contains(id)) return;
					world.remove(id, Pathfind);
					if (pathfind.new?.finished) {
						if (state.verbose) Log.Debug("Pathfind {@id} has finished, running finished callback", id);
						task.spawn(pathfind.new.finished);
					}
				}

				maid.GiveTask(
					path.Error.Connect((errorType) => {
						if (state.debug) Log.Error("Pathfind {@id} has errored: {@Error}", id, errorType);
						endPath(true);
					}),
				);

				maid.GiveTask(
					path.Blocked.Connect(() => {
						if (state.debug) Log.Error("Pathfind {@id} is blocked", id);
						endPath(true);
					}),
				);

				maid.GiveTask(
					path.Reached.Connect(() => {
						if (state.verbose) Log.Info("Pathfind {@id} has reached its destination", id);
						endPath();
					}),
				);

				maid.GiveTask(
					task.delay(watchdogAmount, () => {
						if (world.contains(id)) {
							if (state.debug)
								Log.Error("Pathfind {@id} has timed out after {@Seconds}s", id, watchdogAmount);
							endPath(true);
							return;
						}
						endPath();
					}),
				);
			};

			maid.GiveTask(task.spawn(attemptPathfind));
		}
	}
}

export = pathfind;
