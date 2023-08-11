import { World } from "@rbxts/matter";
import { Body, NPC, Pathfind } from "shared/components";
import Simplepath from "@rbxts/simplepath";
import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";
import Log from "@rbxts/log";

function CanPathfind(world: World, _: ServerState, ui: Widgets) {
	let pathfinds = 0;
	ui.label("Pathfinds: " + pathfinds);
	for (const [id, npc, body, pathfind] of world.query(NPC, Body, Pathfind)) {
		Log.Info(
			"NPC {@id} has pathfind {@pathfind} {@running} {@destination}",
			id,
			pathfind,
			pathfind.running,
			pathfind.destination,
		);
		if (!pathfind.running && pathfind.destination) {
			const path = new Simplepath(body.model);
			path.Run(pathfind.destination);
			world.insert(id, pathfind.patch({ running: true }));
			path.Reached.Connect(() => {
				world.insert(id, pathfind.patch({ running: false, destination: undefined }));
			});
			pathfinds++;
		}
	}
}

export = CanPathfind;
