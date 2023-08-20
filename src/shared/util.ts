import { AnyEntity, World } from "@rbxts/matter";
import { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import Log from "@rbxts/log";
import { Level } from "./components";

export interface ComponentInfo<T extends ComponentCtor> {
	componentId: AnyEntity;
	component: ReturnType<T>;
}

export function fetchComponent<T extends ComponentCtor>(
	world: World,
	componentId: AnyEntity,
	component: T,
): ComponentInfo<T> {
	const _component = getOrError(
		world,
		componentId,
		component,
		"Component {@Component} does not exist",
		"error",
		component,
	);
	return { componentId, component: _component };
}

export function getOrError<T extends ComponentCtor>(
	world: World,
	id: AnyEntity,
	component: T,
	errorMessage: string = "",
	logType: "warn" | "info" | "error" = "error",
	...args: object[]
) {
	if (!world.contains(id)) throw "World does not contain entity";
	const componentInstance = world.get(id, component);

	if (!componentInstance) {
		if (logType === "error") Log.Error(errorMessage, args);
		else if (logType === "warn") Log.Warn(errorMessage, args);
		else Log.Info(errorMessage, args);
		throw errorMessage;
	}
	return componentInstance;
}

export function randomIndex<T>(array: Array<T>) {
	return array[math.random(1, array.size()) - 1];
}
