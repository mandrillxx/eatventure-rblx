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
