import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";

export namespace Network {
	export const summonCustomer = new NetEvent<[name: CustomerNames], NetEventType.ClientToServer>();
	export const hireEmployee = new NetEvent<[name: EmployeeNames], NetEventType.ClientToServer>();
	export const spawnLevel = new NetEvent<[name: keyof Levels], NetEventType.ClientToServer>();
	export const handleKeybind = new NetFunction<[callback: Callback], [handled: boolean]>();
}
