import { ClientState } from "shared/clientState";
import { Upgrade } from "shared/components";
import { World } from "@rbxts/matter";

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
