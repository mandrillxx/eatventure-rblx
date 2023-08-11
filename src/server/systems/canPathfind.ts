import { World, useThrottle } from "@rbxts/matter";
import { Body, NPC, Pathfind } from "shared/components";
import Simplepath from "@rbxts/simplepath";
import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";

function CanPathfind(world: World, _: ServerState, ui: Widgets) {
	let pathfinds = 0;
	ui.label("Pathfinds: " + pathfinds);
	if (useThrottle(1)) {
		for (const [id, npc, body, pathfind] of world.query(NPC, Body, Pathfind)) {
			if (!pathfind.started && pathfind.destination) {
				const path = new Simplepath(body.model);
				path.Run(pathfind.destination);
				pathfinds++;
			}
		}
	}
}

export = CanPathfind;
