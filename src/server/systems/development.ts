import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ServerState } from "server/index.server";
import { Client } from "shared/components";

function development(world: World, _: ServerState, ui: Widgets) {
	const testClicked = ui.button("Test").clicked();

	for (const [id, clients, renderable] of world.query(Client)) {
		if (testClicked) {
			Log.Debug("Clicked {@Player}", clients.player.Name);
		}
	}
}

export = development;
