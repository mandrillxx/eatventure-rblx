import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { Balance } from "shared/components";
import { Client } from "shared/components";
import { World } from "@rbxts/matter";
import Log from "@rbxts/log";
import { store } from "server/data/PlayerData";

function player(world: World, state: ServerState) {
	for (const [id, balance] of world.queryChanged(Balance)) {
		if (balance.new && balance.new.balance) {
			const client = getOrError(world, id, Client, "Player does not have Client component but updated Balance");
			if (state.verbose)
				Log.Info(
					"Updating balance for player {@Name} {@NewBalance} {@OldBalance}",
					client.player.Name,
					balance.new.balance,
					balance.old?.balance,
				);
			(client.player as BasePlayer).leaderstats.Money.Value = balance.new.balance;
		}
	}
}

export = player;
