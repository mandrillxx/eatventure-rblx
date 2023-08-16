import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";
import { ClientState } from "./clientState";
import { AnyEntity } from "@rbxts/matter";
import { StatisticsDefinition, StatisticsSnapshot } from "@rbxts/player-statistics";

export namespace Network {
	export const setStoreStatus = new NetEvent<[open: boolean], NetEventType.ClientToServer>();
	export const provide = new NetEvent<[id: AnyEntity], NetEventType.ClientToServer>();
	export const setState = new NetEvent<[state: Partial<ClientState>], NetEventType.ServerToClient>();
	export const retrieveStatistics = new NetFunction<[], [statistics: StatisticsSnapshot<StatisticsDefinition>]>();
}
