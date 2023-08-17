import { StatisticsDefinition, StatisticsSnapshot } from "@rbxts/player-statistics";
import { NetEvent, NetEventType, NetFunction } from "@rbxts/proton";
import { ClientState } from "./clientState";

export namespace Network {
	export const setStoreStatus = new NetEvent<[open: boolean], NetEventType.ClientToServer>();
	export const setState = new NetEvent<[state: Partial<ClientState>], NetEventType.ServerToClient>();
	export const retrieveStatistics = new NetFunction<[], [statistics: StatisticsSnapshot<StatisticsDefinition>]>();
}
