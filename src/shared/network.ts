import { NetEvent, NetEventType } from "@rbxts/proton";

export namespace Network {
	export const updateBalance = new NetEvent<[amount: number], NetEventType.ServerToClient>();
}
