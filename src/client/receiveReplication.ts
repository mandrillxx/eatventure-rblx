import { ComponentNames, UnionComponentsMap } from "shared/types";
import { AnyComponent, World } from "@rbxts/matter";
import { ReplicatedStorage } from "@rbxts/services";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { ClientState } from "shared/clientState";
import { t } from "@rbxts/t";
import * as Components from "shared/components";
import Log from "@rbxts/log";

const remoteEvent = ReplicatedStorage.WaitForChild("Replication") as RemoteEvent;

export function receiveReplication(world: World, state: ClientState) {
	const entityIdMap = state.entityIdMap;

	remoteEvent.OnClientEvent.Connect((entities: Map<string, Map<ComponentNames, { data?: UnionComponentsMap }>>) => {
		assert(t.map(t.string, t.table)(entities));

		for (const [serverEntityId, componentMap] of entities) {
			let clientEntityId = entityIdMap.get(serverEntityId);

			if (clientEntityId !== undefined && next(componentMap)[0] === undefined) {
				world.despawn(clientEntityId);
				entityIdMap.delete(serverEntityId);
				continue;
			}

			const componentsToInsert = new Array<AnyComponent>();
			const componentsToRemove = new Array<ComponentCtor>();

			const insertNames = new Array<string>();
			const removeNames = new Array<string>();

			for (const [name, container] of componentMap) {
				if (container.data !== undefined) {
					componentsToInsert.push(
						Components[name](container.data as UnionToIntersection<UnionComponentsMap>),
					);
					insertNames.push(name);
				} else {
					componentsToRemove.push(Components[name]);
					removeNames.push(name);
				}
			}

			if (clientEntityId === undefined) {
				clientEntityId = world.spawn(...componentsToInsert);
				if (!world.contains(clientEntityId)) {
					Log.Error("Failed to spawn entity");
					continue;
				}

				entityIdMap.set(serverEntityId, clientEntityId);
			} else {
				if (componentsToInsert.size() > 0) {
					world.insert(clientEntityId, ...componentsToInsert);
				}

				if (componentsToRemove.size() > 0) {
					world.remove(clientEntityId, ...componentsToRemove);
				}
			}
		}
	});
}
