import {
	OpenStatus,
	Renderable,
	BelongsTo,
	Balance,
	Utility,
	Client,
	Level,
	Wants,
	Body,
	NPC,
} from "shared/components";
import { AnyComponent, useEvent, World } from "@rbxts/matter";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ComponentNames } from "shared/types";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { New } from "@rbxts/fusion";

const remoteEvent = New("RemoteEvent")({
	Name: "Replication",
	Parent: ReplicatedStorage,
});

const REPLICATED_COMPONENTS = new Set<ComponentCtor>([
	Client,
	Renderable,
	Balance,
	NPC,
	BelongsTo,
	Body,
	Wants,
	Level,
	OpenStatus,
	Utility,
]);

function replication(world: World): void {
	for (const [_, plr] of useEvent(Players, "PlayerAdded")) {
		const payload = new Map<string, Map<ComponentNames, { data: AnyComponent }>>();

		for (const [id, entityData] of world) {
			const entityPayload = new Map<ComponentNames, { data: AnyComponent }>();
			payload.set(tostring(id), entityPayload);

			for (const [component, componentInstance] of entityData) {
				if (REPLICATED_COMPONENTS.has(component)) {
					entityPayload.set(tostring(component) as ComponentNames, { data: componentInstance });
				}
			}
		}

		remoteEvent.FireClient(plr, payload);
	}

	const changes = new Map<string, Map<ComponentNames, { data: AnyComponent }>>();

	for (const component of REPLICATED_COMPONENTS) {
		for (const [entityId, record] of world.queryChanged(component)) {
			const key = tostring(entityId);
			const name = tostring(component) as ComponentNames;

			if (!changes.has(key)) {
				changes.set(key, new Map());
			}

			if (world.contains(entityId)) {
				changes.get(key)?.set(name, { data: record.new! });
			}
		}
	}

	if (!changes.isEmpty()) {
		remoteEvent.FireAllClients(changes);
	}
}

export = {
	system: replication,
	priority: math.huge,
};
