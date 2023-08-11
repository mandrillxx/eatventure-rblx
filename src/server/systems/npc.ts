import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Body, NPC, Renderable } from "shared/components";

function npc(world: World, _: ServerState, ui: Widgets) {
	for (const [id, npc] of world.query(NPC).without(Body)) {
		Log.Info("Found {@id}, {@NPC} without body", id, npc.name);
		const body = ReplicatedStorage.Assets.Customers.FindFirstChild(npc.name)!.Clone() as NPCCustomer;
		body.Parent = Workspace;

		world.insert(
			id,
			Body({
				model: body,
			}),
			Renderable({
				model: body,
			}),
		);
		Log.Info("Inserted body for {@id} {@Parent} {@Name}", id, body.Parent.Name, body.Parent.Parent!.Name);
	}
}

export = npc;
