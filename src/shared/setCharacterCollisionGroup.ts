import { PhysicsService } from "@rbxts/services";

export function setPartCollisionGroup(character: Model, groupName: "Agency" | "Invincible") {
	for (const v of character.GetDescendants()) {
		if (v.IsA("BasePart")) {
			PhysicsService.SetPartCollisionGroup(v, groupName);
		}
	}
}
