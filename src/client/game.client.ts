import { Proton } from "@rbxts/proton";
import { ControlProvider } from "./providers/control";
import Log, { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ClientState } from "shared/clientState";
import { AnyEntity } from "@rbxts/matter";
import { start } from "shared/start";
import { receiveReplication } from "./receiveReplication";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());
Proton.awaitStart();

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
	overlapParams,
	raycastParams,
	controller: {
		actions: [],
	},
	isJumping: false,
	isRunning: false,
	promptKeyboardKeyCode: Enum.KeyCode.F,
};

start([ReplicatedStorage.Client.systems, ReplicatedStorage.Shared.systems], state)(receiveReplication);

const controlProvider = Proton.get(ControlProvider);

controlProvider.registerClientKeybind("SpawnCustomer", Enum.KeyCode.G, () => {
	Log.Info("Hello from {@Context} {@Message}", "client", "spawning customer NPC");
});
