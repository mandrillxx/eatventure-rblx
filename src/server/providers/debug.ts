import { World } from "@rbxts/matter";
import { Provider } from "@rbxts/proton";
import { ReplicatedStorage } from "@rbxts/services";
import { NPC } from "shared/components";
import { Level } from "shared/components/level";

@Provider()
export default class Debug {
	private world: World | undefined;

	constructor() {}

	setWorld(world: World) {
		this.world = world!;
		world.spawn(
			Level({
				name: "Level1",
				npcs: [],
				products: [],
			}),
		);
	}

	hireEmployee(name: EmployeeNames = "Kenny") {
		assert(this.world !== undefined, "Debug world is undefined");
		const npc = this.world.spawn(
			NPC({
				name,
			}),
		);
		for (const [id, level] of this.world.query(Level)) {
			this.world.insert(id, level.patch({ npcs: [...level.npcs, name] }));
		}
		return npc;
	}

	summonCustomer(name: CustomerNames = "Erik") {
		assert(this.world !== undefined, "Debug world is undefined");
		const npc = this.world.spawn(
			NPC({
				name,
			}),
		);
		return npc;
	}
}
