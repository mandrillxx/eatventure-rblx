import { CharacterRigR15 } from "@rbxts/promise-character";
import { AnyEntity } from "@rbxts/matter";

export enum PlayerState {
	Invincible,
}

export interface ClientState {
	debugEnabled: boolean;
	character: CharacterRigR15;
	isJumping: boolean;
	isRunning: boolean;
	entityIdMap: Map<string, AnyEntity>;
	overlapParams: OverlapParams;
	raycastParams: RaycastParams;
	controller: {
		actions: Array<unknown>;
	};
	promptKeyboardKeyCode: Enum.KeyCode;
}
