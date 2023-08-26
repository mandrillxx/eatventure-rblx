import { ServerState } from "server/index.server";
import { Upgrade } from "shared/components";
import { World } from "@rbxts/matter";

function upgradeFn(world: World, _: ServerState) {
	for (const [id, upgrade] of world.queryChanged(Upgrade)) {
		if (!upgrade.old && upgrade.new) {
			const purchased = upgrade.new.purchased;
			const upgradeType = upgrade.new.type;
			switch (upgradeType) {
				case "EmployeePace":
					break;
				case "NewCustomer":
					break;
				case "NewEmployee":
					break;
				case "UpdateProfit":
					break;
			}
		}
	}
}

export = upgradeFn;
