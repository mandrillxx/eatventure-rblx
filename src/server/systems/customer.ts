import { BelongsTo, Body, Level, NPC, Pathfind, Speech, Wants } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { giveItem } from "server/components/methods";
import Maid from "@rbxts/maid";

function customer(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	for (const [id, wants] of world.queryChanged(Wants)) {
		if (wants.old && wants.new) {
			if (!world.contains(id)) return;

			const npc = getOrError(world, id, NPC, "NPC has Wants component but no NPC component");
			const body = getOrError(world, id, Body, "NPC does not have Body component").model as BaseNPC;
			world.insert(id, Speech({ text: `I want ${wants.new.product.amount}x ${wants.new.product.product}` }));
		}
		if (wants.old && !wants.new) {
			if (!world.contains(id)) return;
			const maid = maids.get(id);
			if (maid) {
				maid.DoCleaning();
				maids.delete(id);
			}
			const belongsTo = getOrError(world, id, BelongsTo, "NPC does not have BelongsTo component");
			const npc = getOrError(world, id, NPC, "NPC has Wants component but no NPC component");
			const body = getOrError(world, id, Body, "NPC does not have Body component").model as BaseNPC;
			world.remove(id, Pathfind);
			world.insert(id, Speech({ text: "Thanks!" }));
			const level = getOrError(world, belongsTo.levelId, Level, "Level does not have Level component");
			if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(belongsTo.client.player))
				state.playerStatisticsProvider.recordEvent(belongsTo.client.player, "customersServed", 1);
			task.delay(2, () => world.despawn(id));
		}
		if (!wants.old && wants.new) {
			maids.set(id, new Maid());
			task.delay(1, () => {
				if (!world.contains(id)) return;
				const npc = getOrError(world, id, NPC, "NPC has Wants component but no NPC component");
				const body = getOrError(world, id, Body, "NPC does not have Body component").model as BaseNPC;
				const maid = maids.get(id)!;

				maid.GiveTask(
					body.ClickDetector.MouseClick.Connect((player) => {
						giveItem({
							player,
							world,
							maid,
							id,
							wants: wants.new!,
							state,
						});
					}),
				);
				world.insert(
					id,
					Speech({ text: `I want ${wants.new!.product.amount}x ${wants.new!.product.product}` }),
				);
			});
		}
	}
}

export = customer;
