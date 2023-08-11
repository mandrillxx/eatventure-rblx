import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";

export namespace Network {
	export const summonCustomer = new NetEvent<[name: NPCNames], NetEventType.ClientToServer>();
	export const handleKeybind = new NetFunction<[callback: Callback], [handled: boolean]>();
}
