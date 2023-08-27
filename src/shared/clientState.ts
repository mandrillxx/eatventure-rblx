import { CharacterRigR15 } from "@rbxts/promise-character";
import { ComponentInfo } from "./util";
import { AnyEntity } from "@rbxts/matter";
import { Upgrade, Utility } from "./components";

export enum PlayerState {
	Invincible,
}

interface StoreStatus {
	open: boolean;
}

export interface ClientState {
	debugEnabled: boolean;
	playerId: AnyEntity | undefined;
	levelId: AnyEntity | undefined;
	storeStatus: StoreStatus;
	utilityUpgrade: ComponentInfo<typeof Utility> | undefined;
	upgrades: Map<AnyEntity, ComponentInfo<typeof Upgrade>>;
	update: (key: "open" | "balance", value: unknown) => void;
	character: CharacterRigR15;
	isRunning: boolean;
	entityIdMap: Map<string, AnyEntity>;
	overlapParams: OverlapParams;
	raycastParams: RaycastParams;
	controller: {
		actions: Array<unknown>;
	};
	promptKeyboardKeyCode: Enum.KeyCode;
}

export interface InferencedServerState {
	debug: boolean;
	verbose: boolean;
}
