import { Balance, BelongsTo, Upgrade } from "shared/components";
import { ComponentInfo, getOrError } from "shared/util";
import { ServerEntityIdToClient } from "client/methods";
import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { Players } from "@rbxts/services";
import Log from "@rbxts/log";

const player = Players.LocalPlayer;

function getAllUpgradesForPlayer(state: ClientState, world: World, playerId: AnyEntity) {
	const upgrades: ComponentInfo<typeof Upgrade>[] = [];
	for (const [id, upgrade, belongsTo] of world.query(Upgrade, BelongsTo)) {
		if (ServerEntityIdToClient(state, belongsTo.playerId) === playerId) {
			upgrades.push({ componentId: id, component: upgrade });
		}
	}

	return upgrades.sort((a, b) => a.component.cost <= b.component.cost);
}

function upgrade(world: World, state: ClientState) {
	for (const [id, upgrade] of world.queryChanged(Upgrade)) {
		if (!upgrade.old && upgrade.new) {
			state.upgrades.set(id, { componentId: id, component: upgrade.new });
		}
		if (upgrade.old && !upgrade.new) {
			state.upgrades.delete(id);
		}
	}
}

export = upgrade;
