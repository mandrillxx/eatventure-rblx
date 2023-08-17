import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";
import { Client } from "shared/components";

const player = Players.LocalPlayer;

function client(world: World, state: ClientState) {
	for (const [id, client] of world.queryChanged(Client)) {
		if (!client.old && client.new && client.new.player.UserId === player.UserId) {
			state.playerId = id;
			continue;
		}
	}
}

export = client;
