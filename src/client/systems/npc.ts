import { ServerEntityIdToClient } from "client/methods";
import { BelongsTo, Body } from "shared/components";
import { ClientState } from "shared/clientState";
import { getOrError } from "shared/util";
import { World } from "@rbxts/matter";
import Maid from "@rbxts/maid";
import { New } from "@rbxts/fusion";

function npc(world: World, state: ClientState) {
	const maid = new Maid();
	for (const [id, body] of world.queryChanged(Body)) {
		if (!world.contains(id)) continue;
		const belongsTo = getOrError(world, id, BelongsTo, "Body does not have BelongsTo component");
		if (ServerEntityIdToClient(state, belongsTo.playerId) !== state.playerId) continue;

		if (!body.old && body.new) {
			const model = body.new.model as BaseNPC;
			if (!model.FindFirstChild("ClickDetector"))
				New("ClickDetector")({ Parent: model, MaxActivationDistance: 48 });
			maid.GiveTask(
				model.ClickDetector.MouseHoverEnter.Connect(() => {
					model.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.Viewer;
				}),
			);
			maid.GiveTask(
				model.ClickDetector.MouseHoverLeave.Connect(() => {
					model.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
				}),
			);
		}
		if (body.old && !body.new) {
			maid.DoCleaning();
		}
	}
}

export = npc;
