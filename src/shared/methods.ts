import { Client, Renderable } from "./components";
import { AnyEntity, World } from "@rbxts/matter";
import { getOrError } from "./util";

export function getLevelUtilities(world: World, levelId: AnyEntity) {
	const levelRenderable = getOrError(world, levelId, Renderable);
	const levelModel = levelRenderable.model as BaseLevel;
	return levelModel.Utilities.GetChildren().map((utility) => utility.Name);
}

export function getLevelUtilityAmount(world: World, levelId: AnyEntity) {
	return getLevelUtilities(world, levelId).size();
}

export function getPlayerMaxedUtilities(world: World, playerId: AnyEntity, levelId: AnyEntity) {
	const levelUtilities = getLevelUtilities(world, levelId);
	const client = getOrError(world, playerId, Client);
	const player = client.player as BasePlayer;
	let maxed = 0;

	for (const utility of levelUtilities) {
		if (
			player.Utilities.FindFirstChild(utility) &&
			(player.Utilities.FindFirstChild(utility) as IntValue).Value >= 150
		) {
			maxed++;
		}
	}

	return maxed;
}
