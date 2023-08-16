import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { Body, Holding, NPC, Pathfind, Wants } from "shared/components";

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
			body.DialogGui.DialogFrame.DialogText.Text = `I want ${wants.new.product.amount}x ${wants.new.product.product}`;
			body.DialogGui.Enabled = true;
		}
		if (wants.old && !wants.new) {
			if (!world.contains(id)) return;
			const maid = maids.get(id);
			if (maid) {
				maid.DoCleaning();
				maids.delete(id);
			}
			const npc = world.get(id, NPC);
			const body = world.get(id, Body)?.model as BaseNPC;
			if (!npc || !body) {
				Log.Error("No NPC or Body component for customer");
				continue;
			}
			world.remove(id, Pathfind);
			body.DialogGui.DialogFrame.DialogText.Text = "Thanks!";
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
						if (!world.contains(id) || !wants.new) return;
						const currentWants = world.get(id, Wants);
						if (!currentWants) {
							if (state.verbose) Log.Info("Customer no longer wants anything, cleaning up");
							maid.DoCleaning();
							return;
						}
						const playerId = state.clients.get(player.UserId)!;
						const playerHolding = world.get(playerId, Holding);
						if (!playerHolding) {
							if (state.verbose) Log.Info("Player not holding anything, cannot provide for NPC");
							return;
						}
						const playerHoldingRequestedProduct = playerHolding.product.find(
							(product) => product.product === currentWants.product.product,
						);
						if (!playerHoldingRequestedProduct) {
							if (state.verbose) Log.Info("Player not holding requested product, cannot provide for NPC");
							return;
						}
						world.insert(
							playerId,
							playerHolding.patch({
								product: [
									...playerHolding.product.filter(
										(product) => product.product !== playerHoldingRequestedProduct.product,
									),
									{
										...playerHoldingRequestedProduct,
										amount: playerHoldingRequestedProduct.amount - 1,
									},
								],
							}),
						);
						if (currentWants.product.amount === 1) {
							Log.Info("NPC {@NPC} got what they wanted", id);
							world.remove(id, Wants);
						} else {
							Log.Info("NPC {@NPC} got what they wanted, but still wants more", id);
							world.insert(
								id,
								currentWants.patch({
									product: { ...currentWants.product, amount: currentWants.product.amount - 1 },
								}),
							);
						}
					}),
				);
				body.DialogGui.DialogFrame.DialogText.Text = `I want ${wants.new!.product.amount}x ${
					wants.new!.product.product
				}`;
				body.DialogGui.Enabled = true;
			});
		}
	}
}

export = customer;
