import { BelongsTo, Body, Holding, NPC, Pathfind, Speech, Wants } from "shared/components";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import Maid from "@rbxts/maid";
import Log from "@rbxts/log";
import { giveItem } from "server/components/methods";

function customer(world: World, state: ServerState) {
	const maids = new Map<AnyEntity, Maid>();

	for (const [id, wants] of world.queryChanged(Wants)) {
		if (wants.old && wants.new) {
			if (!world.contains(id)) return;

			const npc = world.get(id, NPC);
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			world.insert(id, Speech({ text: `I want ${wants.new.product.amount}x ${wants.new.product.product}` }));
		}
		if (wants.old && !wants.new) {
			if (!world.contains(id)) return;
			const maid = maids.get(id);
			if (maid) {
				maid.DoCleaning();
				maids.delete(id);
			}
			const npc = world.get(id, NPC);
			const belongsTo = world.get(id, BelongsTo)!;
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			world.remove(id, Pathfind);
			world.insert(id, Speech({ text: "Thanks!" }));
			if (state.playerStatisticsProvider.areStatisticsLoadedForPlayer(belongsTo.client.player))
				state.playerStatisticsProvider.recordEvent(belongsTo.client.player, "customersServed", 1);
			task.delay(2, () => world.despawn(id));
		}
		if (!wants.old && wants.new) {
			maids.set(id, new Maid());
			task.delay(1, () => {
				if (!world.contains(id)) return;
				const npc = world.get(id, NPC);
				const body = world.get(id, Body)?.model as BaseNPC;
				if (!npc || !body) {
					Log.Error("No NPC or Body component for customer");
					return;
				}
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
