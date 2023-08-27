import { Players, ReplicatedStorage, SoundService, UserInputService } from "@rbxts/services";
import { SoundEffect, Upgrade } from "shared/components";
import { receiveReplication } from "./receiveReplication";
import { withHookDetection } from "@rbxts/roact-hooked";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ComponentInfo } from "shared/util";
import { ClientState } from "shared/clientState";
import { Soundtrack } from "shared/soundtrack";
import { AnyEntity } from "@rbxts/matter";
import { Network } from "shared/network";
import { Proton } from "@rbxts/proton";
import { start } from "shared/start";
import Log, { Logger } from "@rbxts/log";
import Roact from "@rbxts/roact";
import Menu from "./components/menu";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
const mouse = player.GetMouse();
const overlapParams = new OverlapParams();
const raycastParams = new RaycastParams();

overlapParams.FilterDescendantsInstances = [character];
raycastParams.FilterDescendantsInstances = [character];

const state: ClientState = {
	debugEnabled: true,
	entityIdMap: new Map<string, AnyEntity>(),
	character,
	playerId: undefined,
	levelId: undefined,
	utilityUpgrade: undefined,
	upgrades: new Map<AnyEntity, ComponentInfo<typeof Upgrade>>(),
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
	update: () => {},
};

const world = start([ReplicatedStorage.Client.systems, ReplicatedStorage.Shared.systems], state)(receiveReplication);

function setupSoundtrack() {
	const soundtrack = new Soundtrack(SoundService.Soundtrack);
	soundtrack.Play();
}

function bootstrap() {
	withHookDetection(Roact);
	while (!state.playerId) {
		task.wait(1);
	}

	UserInputService.InputBegan.Connect((input) => {
		if (
			input.UserInputType === Enum.UserInputType.MouseButton1 ||
			input.UserInputType === Enum.UserInputType.Touch
		) {
			const target = mouse.Target;
			if (target && target.IsA("BasePart")) {
				const utilityInfo = player
					.FindFirstChildOfClass("PlayerGui")!
					.WaitForChild("UtilityInfo")! as UtilityInfoInstance;
				const adornee = utilityInfo.Adornee;
				if (adornee && !target.IsDescendantOf(adornee)) {
					utilityInfo.Adornee = undefined;
					utilityInfo.Enabled = false;
				}
			}
		}
	});

	setupSoundtrack();

	task.delay(1, () => {
		const money = (player as BasePlayer).leaderstats.Money;
		const update = (value?: number) => state.update("balance", value ?? money.Value);
		update();
		money.Changed.Connect((newValue) => {
			update(newValue);
		});
		const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
		const utilityInfo = playerGui.WaitForChild("UtilityInfo")! as UtilityInfoInstance;
		utilityInfo.Background.Upgrade.MouseButton1Click.Connect(() => {
			Network.upgradeUtility.client.fire(utilityInfo.Adornee! as Model);
		});
		const upgradeInfo = playerGui.WaitForChild("UpgradeInfo")! as UpgradeInfoInstance;
		upgradeInfo.UpgradeFrame.Close.MouseButton1Click.Connect(() => {
			upgradeInfo.UpgradeFrame.Visible = false;
		});
		const overlayGui = playerGui.WaitForChild("Overlay")! as OverlayGui;
		overlayGui.OpenUpgrades.MouseButton1Click.Connect(() => {
			world.spawn(SoundEffect({ sound: "UIClick", meantFor: player }));
			upgradeInfo.UpgradeFrame.Visible = !upgradeInfo.UpgradeFrame.Visible;
		});
		overlayGui.OpenSettings.MouseButton1Click.Connect(() => {
			world.spawn(SoundEffect({ sound: "UIClick", meantFor: player }));
			overlayGui.Settings.Visible = !overlayGui.Settings.Visible;
		});
		overlayGui.Settings.Frame.Music.Holder.Amount.Changed.Connect((newValue) => {
			SoundService.Soundtrack.Volume = newValue / 100;
		});
		overlayGui.Settings.Close.MouseButton1Click.Connect(() => {
			world.spawn(SoundEffect({ sound: "UIClick", meantFor: player }));
			overlayGui.Settings.Visible = false;
		});
		overlayGui.Settings.Frame.SoundFX.Holder.Amount.Changed.Connect((newValue) => {
			SoundService.SoundFX.Volume = (newValue / 100) * 2;
		});
	});

	Roact.mount(<Menu state={state} />, player.FindFirstChildOfClass("PlayerGui")!);
	// Roact.mount(<Npc state={state} npc={{ name: "Erik" }} />, player.FindFirstChildOfClass("PlayerGui")!);

	Network.setState.client.connect((state) => {
		state = { ...state };
	});
}

bootstrap();
