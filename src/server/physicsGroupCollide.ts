import { New } from "@rbxts/fusion";
import create from "@rbxts/objecat";
import { PhysicsService, ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { setPartCollisionGroup } from "shared/setCharacterCollisionGroup";

const agencyCollisionGroupName = "Agency";
const invincibleCollisionGroupName = "Invincible";
PhysicsService.CreateCollisionGroup(agencyCollisionGroupName);
PhysicsService.CreateCollisionGroup(invincibleCollisionGroupName);
PhysicsService.CollisionGroupSetCollidable(agencyCollisionGroupName, agencyCollisionGroupName, false);
const physicsGroupCollide = New("RemoteEvent")({
	Name: "PhysicsGroupCollide",
	Parent: ReplicatedStorage,
});

export function setupPhysicsCollisionRemove() {
	physicsGroupCollide.OnServerEvent.Connect((player, groupName) => {
		assert(t.string(groupName));

		if (player.Character) {
			setPartCollisionGroup(player.Character, groupName as "Agency" | "Invincible");
		}
	});
}
