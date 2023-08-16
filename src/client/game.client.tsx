import Log, { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ClientState } from "shared/clientState";
import { AnyComponent, AnyEntity } from "@rbxts/matter";
import { start } from "shared/start";
import { receiveReplication } from "./receiveReplication";
import Roact from "@rbxts/roact";
import { withHookDetection } from "@rbxts/roact-hooked";
import { Proton } from "@rbxts/proton";
import Menu from "./components/menu";
import { Network } from "shared/network";
import { Client } from "shared/components";
import Npc from "./components/npc";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
const overlapParams = new OverlapParams();
const raycastParams = new RaycastParams();

overlapParams.FilterDescendantsInstances = [character];
raycastParams.FilterDescendantsInstances = [character];

const state: ClientState = {
	debugEnabled: true,
	entityIdMap: new Map<string, AnyEntity>(),
	character,
	playerId: undefined,
	storeStatus: {
		open: false,
	},
	overlapParams,
	raycastParams,
	controller: {
		actions: [],
	},
	isRunning: false,
	promptKeyboardKeyCode: Enum.KeyCode.F,
};

const world = start([ReplicatedStorage.Client.systems, ReplicatedStorage.Shared.systems], state)(receiveReplication);

withHookDetection(Roact);
task.delay(1, () => {
	if (!state.playerId) {
		Log.Error("{@PlayerName}'s state was not set", player.Name);
		return;
	}
	Roact.mount(
		<Menu world={world} playerId={state.playerId} state={state} />,
		player.FindFirstChildOfClass("PlayerGui")!,
	);
	// Roact.mount(<Npc npc={{ name: "Erik" }} />, player.FindFirstChildOfClass("PlayerGui")!);
});

while (!state.playerId) {
	task.wait(1);
}

Network.setState.client.connect((state) => {
	state = { ...state };
});
