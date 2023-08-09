import { Proton, Provider } from "@rbxts/proton";
import { StatsProvider } from "./stats";
import Maid from "@rbxts/maid";

@Provider()
export class GameProvider {
	private readonly statsProvider = Proton.get(StatsProvider);
	private readonly NPCRegistry = new Map<NPCType, BaseNPC[]>();
	private maid = new Maid();

	constructor() {}

	registerClientKeybind(player: Player, callback: Callback) {
		callback();
	}

	registerNPC(npcType: NPCType, npc: BaseNPC) {
		this.maid.GiveTask(() => {
			this.NPCRegistry.set(npcType, [npc]);
		});
	}

	clearNpcs() {
		this.maid.DoCleaning();
		this.NPCRegistry.clear();
	}
}
