import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ClientState } from "shared/clientState";

function development(_world: World, _: ClientState, ui: Widgets) {
	const npcs: NPCNames[] = ["Erik", "Kendra", "Kenny", "Sophia"];
	for (const npc of npcs) {
		if (ui.button(`Spawn ${npc}`).clicked()) {
			Log.Debug("Spawning NPC {@NPC}", npc);
		}
	}
}

export = development;
