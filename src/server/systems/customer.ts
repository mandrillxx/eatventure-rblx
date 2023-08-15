import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Wants } from "shared/components";

function customer(world: World, _: ServerState) {
	for (const [id, wants] of world.queryChanged(Wants)) {
		if (!wants.old && wants.new) {
			Log.Info(`Wants ${id} | ${wants.new.product.amount}x ${wants.new.product.product}`);
		}
	}
}

export = customer;
