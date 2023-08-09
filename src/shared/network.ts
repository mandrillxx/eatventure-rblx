import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";

export namespace Network {
	export const handleKeybind = new NetFunction<[callback: Callback], [handled: boolean]>();
}
