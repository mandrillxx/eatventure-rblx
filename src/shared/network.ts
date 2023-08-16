import { NetEvent, NetEventType } from "@rbxts/proton";
import { ClientState } from "./clientState";

export namespace Network {
	export const setStoreStatus = new NetEvent<[open: boolean], NetEventType.ClientToServer>();
	export const setState = new NetEvent<[state: Partial<ClientState>], NetEventType.ServerToClient>();
}
