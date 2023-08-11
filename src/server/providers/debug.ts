import { World } from "@rbxts/matter";
import { Provider } from "@rbxts/proton";
import { Animate, NPC, Pathfind } from "shared/components";

@Provider()
export default class Debug {
	private world: World | undefined;

	constructor() {}

	setWorld(world: World) {
		this.world = world!;
	}

	summonCustomer(name: NPCNames = "Erik") {
		assert(this.world !== undefined, "Debug world is undefined");
		const npc = this.world.spawn(
			NPC({
				name,
			}),
			Pathfind({
				destination: undefined,
				started: false,
			}),
			Animate(),
		);
	}
}
