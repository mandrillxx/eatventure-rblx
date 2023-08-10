import { New } from "@rbxts/fusion";
import { World } from "@rbxts/matter";
import create from "@rbxts/objecat";
import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Client } from "shared/components";

const remoteEvent = New("RemoteEvent")({
	Name: "TrackLineOfSight",
	Parent: ReplicatedStorage,
});

function trackLineSight(world: World) {
	remoteEvent.OnServerEvent.Connect((player, lineSight) => {
		assert(t.Vector3(lineSight));

		world.optimizeQueries();

		for (const [id, client] of world.query(Client)) {
			if (client.player === player) {
				world.insert(id, client.patch({ lineSight }));
				break;
			}
		}
	});
}

export = trackLineSight;
