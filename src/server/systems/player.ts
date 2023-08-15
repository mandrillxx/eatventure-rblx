import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Client } from "shared/components";
import { Balance } from "shared/components/game";
import { Network } from "shared/network";

function player(world: World, _: ServerState) {
	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new && balance.new.balance) {
			const client = world.get(id, Client);
			if (!client) {
				Log.Error("No client found for balance component");
				continue;
			}
			Log.Info(
				"Updating balance for player {@Name} {@NewBalance} {@OldBalance}",
				client.player.Name,
				balance.new.balance,
				balance.old?.balance,
			);
			Network.updateBalance.server.fire(client.player, balance.new.balance);
		}
	}
}

export = player;
