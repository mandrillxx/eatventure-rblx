import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Body, NPC, Renderable } from "shared/components";
import { Balance } from "shared/components/game";

function npc(world: World, _: ServerState) {
	for (const [id, npc] of world.query(NPC).without(Body)) {
		let bodyModel = ReplicatedStorage.Assets.NPCs.FindFirstChild(npc.name) as BaseNPC;
		if (!bodyModel) {
			Log.Error("NPC {@NPCName} does not have a representative asset", npc.name);
			continue;
		}

		bodyModel = bodyModel.Clone();
		bodyModel.ID.Value = id;
		bodyModel.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.Viewer;
		bodyModel.Parent = Workspace.NPCs;

		world.insert(
			id,
			Body({
				model: bodyModel,
			}),
			Renderable({
				model: bodyModel,
			}),
		);
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (npc.old && !npc.new) {
			if (world.contains(id)) world.remove(id);
		}
	}

	for (const [_id, body] of world.queryChanged(Body)) {
		if (body.old && body.old.model && !body.new) {
			body.old.model.Destroy();
		}
	}
}

export = npc;
