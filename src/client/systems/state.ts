import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";
import { Balance, OpenStatus } from "shared/components";

const player = Players.LocalPlayer;

function state(world: World, state: ClientState) {
	for (const [_id, balance] of world.queryChanged(Balance)) {
		if (balance.new) {
			state.update("balance", balance.new.balance);
		}
	}
	for (const [_id, openStatus] of world.queryChanged(OpenStatus)) {
		if (openStatus.new) {
			state.update("open", openStatus.new.open);
		}
	}
}

export = state;
