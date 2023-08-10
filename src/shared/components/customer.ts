import { World } from "@rbxts/matter";
import { Customer } from ".";

function CustomerNPC(world: World) {
	for (const [id, customer] of world.query(Customer)) {
	}
}
