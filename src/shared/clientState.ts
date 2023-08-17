import { CharacterRigR15 } from "@rbxts/promise-character";
import { AnyEntity } from "@rbxts/matter";

export enum PlayerState {
	Invincible,
}

interface StoreStatus {
	open: boolean;
}

export interface ClientState {
	debugEnabled: boolean;
	playerId: AnyEntity | undefined;
	storeStatus: StoreStatus;
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
