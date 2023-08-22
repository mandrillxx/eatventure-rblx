import { AnyEntity, World } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Body, Pathfind } from "shared/components";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import Simplepath from "@rbxts/simplepath";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";

function attemptFix(body: CharacterRigR15) {}

function pathfind(world: World, state: ServerState) {
	const pathfindErrors = new Map<AnyEntity, number>();

	for (const [id, pathfind] of world.queryChanged(Pathfind)) {
		if (!pathfind.old && pathfind.new && pathfind.new.destination && !pathfind.new.running) {
			if (!world.contains(id)) continue;
			if (state.verbose) Log.Debug("Pathfind {@id} is moving to {@Destination}", id, pathfind.new.destination);
			world.insert(id, pathfind.new.patch({ running: true }));
			const body = getOrError(world, id, Body, "NPC does not have Body component but has Pathfind component");
			const destination = pathfind.new.destination;
			const watchdogAmount = 10;
			const maid = new Maid();

			const attemptPathfind = () => {
				if (pathfindErrors.has(id) && pathfindErrors.get(id)! >= 10) {
					Log.Error("Pathfind {@id} has errored too many times, trying to fix", id);
					pathfindErrors.delete(id);
					attemptFix(body.model as CharacterRigR15);
				}

				if (!body.model.IsA("Model") || !body.model.PrimaryPart) {
					if (state.debug) Log.Warn("Pathfind {@id} has no model, retrying", id);
					attemptPathfind();
					return;
				}

				const path = new Simplepath(
					body.model,
					{
						AgentRadius: 1,
						AgentHeight: 4,
						AgentCanJump: true,
					},
					{
						JUMP_WHEN_STUCK: true,
					},
				);
				path.Visualize = state.debug;

				const isPathfinding = path.Run(destination);
				if (!isPathfinding) {
					if (pathfindErrors.has(id)) {
						pathfindErrors.set(id, pathfindErrors.get(id)! + 1);
					} else {
						pathfindErrors.set(id, 1);
					}
					if (state.debug)
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
						if (pathfindErrors.has(id)) {
							pathfindErrors.set(id, pathfindErrors.get(id)! + 1);
						} else {
							pathfindErrors.set(id, 1);
						}
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
