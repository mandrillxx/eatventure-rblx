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
	const spawnCustomer = ui.button("Spawn Customer").clicked();
	const spawnLevel = ui.button("Spawn Level").clicked();
	const teleportHome = ui.button("Teleport").clicked();
	const open = ui.checkbox("Shop Open");

	if (open.clicked()) {
		Log.Debug("Shop is {@Open}", open.checked());
	}

	if (spawnCustomer) {
		Network.summonCustomer.client.fire("Sophia");
		Log.Debug("Spawned customer");
	}

	if (makeEmployeeMove) {
		Network.moveEmployee.client.fire("Kenny");
		Log.Debug("Made employee move");
	}

	if (spawnLevel) {
		Network.spawnLevel.client.fire("Level1");
		Log.Debug("Spawned level");
	}

	if (hireEmployee) {
		Network.hireEmployee.client.fire("Kenny");
		Log.Debug("Hired employee");
	}

	if (teleportHome) {
		Log.Debug("{@Player} teleported home", player.Name);
	}
}

export = development;
