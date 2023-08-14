import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";
import { Client } from "shared/components";
import { Network } from "shared/network";

const player = Players.LocalPlayer;

function development(world: World, _: ClientState, ui: Widgets) {
	ui.heading("Menu");
	const hireEmployee = ui.button("Hire Employee").clicked();
	const makeEmployeeMove = ui.button("Move Employee").clicked();
	const makeEmployeeEmote = ui.button("Employee Emote").clicked();
	const spawnCustomer = ui.button("Spawn Customer").clicked();
	const spawnLevel = ui.button("Spawn Level").clicked();
	const teleportHome = ui.button("Teleport").clicked();
	const open = ui.checkbox("Shop Open");

	if (open.clicked()) {
		Log.Debug("Shop is {@Open}", open.checked());
	}

	if (spawnCustomer) {
		Log.Debug("Spawned customer");
	}

	if (makeEmployeeEmote) {
		Log.Debug("Made employee emote");
	}

	if (makeEmployeeMove) {
		Log.Debug("Made employee move");
	}

	if (spawnLevel) {
		Log.Debug("Spawned level");
	}

	if (hireEmployee) {
		Log.Debug("Hired employee");
	}

	if (teleportHome) {
		Log.Debug("{@Player} teleported home", player.Name);
	}
}

export = development;
