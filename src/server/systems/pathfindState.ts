import { World } from "@rbxts/matter";
import { Pathfind } from "shared/components";
import Log from "@rbxts/log";

function PathfindState(world: World) {
	for (const [id, pathfind] of world.queryChanged(Pathfind)) {
		if (!pathfind.new || !pathfind.old) return;
		if (pathfind.old.running && pathfind.old.destination !== pathfind.new.destination) {
			world.insert(id, pathfind.new.patch({ running: false }));
			Log.Debug("NPC {@id} reached the destination", id);
		} else if (
			!pathfind.old.running &&
			!pathfind.old.destination &&
			!pathfind.new.running &&
			pathfind.new.destination
		) {
			world.insert(id, pathfind.new.patch({ running: true }));
			Log.Debug("NPC {@id} started pathfinding", id);
		}
	}
}

export = PathfindState;
