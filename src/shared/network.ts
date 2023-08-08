import { NetEvent, NetEventType } from "@rbxts/proton";

export namespace Network {
	export const test = new NetEvent<[message: string], NetEventType.ServerToClient>();
}
