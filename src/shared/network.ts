import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";

export namespace Network {
	export const moveEmployee = new NetEvent<[name: EmployeeNames], NetEventType.ClientToServer>();
	export const emoteEmployee = new NetEvent<
		[name: EmployeeNames, type: AnimationType],
		NetEventType.ClientToServer
	>();
	export const summonCustomer = new NetEvent<[name: CustomerNames], NetEventType.ClientToServer>();
	export const hireEmployee = new NetEvent<[name: EmployeeNames], NetEventType.ClientToServer>();
	export const spawnLevel = new NetEvent<[name: keyof Levels], NetEventType.ClientToServer>();
	export const handleKeybind = new NetFunction<[callback: Callback], [handled: boolean]>();
}
