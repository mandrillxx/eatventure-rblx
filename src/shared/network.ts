import { StatisticsDefinition, StatisticsSnapshot } from "@rbxts/player-statistics";
import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";
import { ClientState } from "./clientState";
import { AnyEntity } from "@rbxts/matter";

export namespace Network {
	export const setStoreStatus = new NetEvent<[open: boolean], NetEventType.ClientToServer>();
	export const setStoreName = new NetEvent<[name: string], NetEventType.ClientToServer>();
	export const setState = new NetEvent<[state: Partial<ClientState>], NetEventType.ServerToClient>();
	export const unlockUtility = new NetEvent<[adornee: Model], NetEventType.ClientToServer>();
	export const upgradeUtility = new NetEvent<[adornee: Model], NetEventType.ClientToServer>();
	export const purchaseUpgrade = new NetEvent<[upgradeId: AnyEntity], NetEventType.ClientToServer>();
	export const retrieveStatistics = new NetFunction<[], [statistics: StatisticsSnapshot<StatisticsDefinition>]>();
	export const redeemCode = new NetFunction<[code: string], [status: "success" | "fail" | "used"]>();
	export const testFunction = new NetFunction<[code: string], [status: "success" | "fail" | "used"]>();
}
