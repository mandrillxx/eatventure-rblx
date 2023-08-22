import { ServerState } from "server/index.server";
import { Widgets } from "@rbxts/plasma";
import { World } from "@rbxts/matter";

function admin(_world: World, state: ServerState, ui: Widgets) {
	// ui.heading("Admin Controls");
	// const debug = ui.checkbox("Debug", {
	//     checked: state.debug,
	// });
	// const verbose = ui.checkbox("Verbose", {
	// 	checked: state.verbose,
	// });
	// if (debug.clicked()) {
	// 	state.debug = debug.checked();
	// }
	// if (verbose.clicked()) {
	// 	state.verbose = verbose.checked();
	// }
}

export = admin;
