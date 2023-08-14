import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Animate, Body, NPC, Pathfind, Renderable, Transform } from "shared/components";

function npc(world: World, state: ServerState, ui: Widgets) {
	if (ui.button("Spawn NPC").clicked()) {
		const world = state.levels.get("Level1")!;
		world.spawn(
			NPC({
				name: "Erik",
				world,
			}),
		);
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (!npc.old && npc.new) {
			const world = state.levels.get("Level1")!;
			world.Levell.npcs.push(npc.new);
		}
	}

	for (const [id, npc] of world.query(NPC).without(Body)) {
		Log.Info("Found {@id}, {@NPC} without body", id, npc.name);
		const body = ReplicatedStorage.Assets.NPCs.FindFirstChild(npc.name)!.Clone() as BaseNPC;
		body.Parent = Workspace;
		body.ID.Value = id;

		world.insert(
			id,
			Body({
				model: body,
			}),
			Renderable({
				model: body,
			}),
			Transform({
				cf: body.PrimaryPart!.CFrame,
			}),
			Animate(),
		);

		Log.Info("Inserted body for {@id} {@Parent} {@Name}", id, body.Parent.Name, body.Parent.Parent!.Name);
	}
}

export = npc;
