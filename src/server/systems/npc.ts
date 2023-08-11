import Log from "@rbxts/log";
import { World, useThrottle } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Animate, Body, NPC, Pathfind, Renderable, Transform } from "shared/components";

const RNG = new Random();
function npc(world: World, _: ServerState, ui: Widgets) {
	for (const [id, npc] of world.query(NPC).without(Body)) {
		Log.Info("Found {@id}, {@NPC} without body", id, npc.name);
		const body = ReplicatedStorage.Assets.NPCs.FindFirstChild(npc.name)!.Clone() as BaseNPC;
		body.Parent = Workspace;

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
			Pathfind({
				destination: undefined,
				running: false,
			}),
			Animate(),
		);

		Log.Info("Inserted body for {@id} {@Parent} {@Name}", id, body.Parent.Name, body.Parent.Parent!.Name);
	}

	// for (const [id, npc, transform, pathfind] of world.query(NPC, Transform, Pathfind)) {
	// 	if (useThrottle(RNG.NextInteger(4, 5), id)) {
	// 		Log.Debug("NPC {@id} is moving ---------", id);
	// 		if (!pathfind.running) {
	// 			const targetPosition = transform.cf.add(
	// 				new Vector3(math.random(-16, 16), 0, math.random(-16, 16)),
	// 			).Position;
	// 			Log.Debug("NPC {@id} is moving to {@targetPosition}", id, targetPosition);
	// 			world.insert(
	// 				id,
	// 				Pathfind({
	// 					destination: targetPosition,
	// 					running: false,
	// 				}),
	// 			);
	// 		}
	// 	}
	// }
}

export = npc;
