import Log, { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ClientState } from "shared/clientState";
import { AnyEntity } from "@rbxts/matter";
import { start } from "shared/start";
import { receiveReplication } from "./receiveReplication";
import Roact from "@rbxts/roact";
import { withHookDetection } from "@rbxts/roact-hooked";
import { Proton } from "@rbxts/proton";
import Menu from "./components/menu";
import { Network } from "shared/network";
import { Balance } from "shared/components/game";
import { Client } from "shared/components";

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
	Roact.mount(<Menu world={world} playerId={state.playerId} />, player.FindFirstChildOfClass("PlayerGui")!);
});

while (!state.playerId) {
	task.wait(1);
}

Network.updateBalance.client.connect((amount) => {
	if (!state.playerId) {
		Log.Error("Server tried to update balance but player id was not set for {@PlayerName}", player.Name);
		return;
	}
	const client = world.get(state.playerId, Client);
	if (!client) {
		Log.Error("Server tried to update balance but client component was not found for {@PlayerName}", player.Name);
		return;
	}
	const balance = world.get(state.playerId, Balance);
	if (!balance) {
		Log.Info("Balance component was not found for {@PlayerName}, creating one", player.Name);
		world.insert(
			state.playerId,
			Balance({
				balance: amount,
			}),
		);
		return;
	}
	Log.Info("Updating balance for {@PlayerName} to {@Balance}", player.Name, amount);
	world.insert(
		state.playerId,
		balance.patch({
			balance: amount,
		}),
	);
});
