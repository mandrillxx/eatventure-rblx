import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ServerState } from "server/index.server";

function development(world: World, _: ServerState, ui: Widgets) {
	ui.heading("Menu");
}

export = development;
