import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";
import { Client } from "shared/components";

const player = Players.LocalPlayer;

function development(world: World, _: ClientState, ui: Widgets) {
	ui.heading("Employees");
	const employeeCount = ui.slider(10);
	ui.label(string.format("%.0f", employeeCount));
	const hireEmployee = ui.button("Set Employees").clicked();
	ui.space(2);
	ui.heading("Customers");
	const customerCount = ui.slider(25);
	ui.label(string.format("%.0f", customerCount));
	const setCustomers = ui.button("Set Customers").clicked();
	ui.space(5);
	ui.heading("Menu");
	const teleportHome = ui.button("Teleport").clicked();
	const open = ui.checkbox("Shop Open");

	if (open.clicked()) {
		Log.Debug("Shop is {@Open}", open.checked());
	}

	if (setCustomers) {
		Log.Debug("Set customer amount to {@Customers}", customerCount);
	}

	if (hireEmployee) {
		Log.Debug("Set employee amount to {@Employees}", employeeCount);
	}

	if (teleportHome) {
		Log.Debug("{@Player} teleported home", player.Name);
	}
}

export = development;
