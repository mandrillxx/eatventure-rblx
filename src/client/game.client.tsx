import { MarketplaceService, Players, ReplicatedStorage, SoundService, UserInputService } from "@rbxts/services";
import { receiveReplication } from "./receiveReplication";
import { withHookDetection } from "@rbxts/roact-hooked";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ComponentInfo } from "shared/util";
import { ClientState } from "shared/clientState";
import { Soundtrack } from "shared/soundtrack";
import { AnyEntity } from "@rbxts/matter";
import { Network } from "shared/network";
import { Upgrade } from "shared/components";
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
	return soundtrack;
}

function setupSprinting() {
	UserInputService.InputBegan.Connect((input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			state.isRunning = true;
			character.Humanoid.WalkSpeed = 32;
		}
	});
	UserInputService.InputEnded.Connect((input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			state.isRunning = false;
			character.Humanoid.WalkSpeed = 16;
		}
	});
}

function setupUtilityGui() {
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
}

function DevProducts(overlay: NewOverlayGui) {
	const devProducts = overlay.DevProducts;
	devProducts.Close.ImageButton.MouseButton1Click.Connect(() => {
		devProducts.Visible = false;
	});
	devProducts.Content.Body["1000Cash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622826603);
	});
	devProducts.Content.Body["5000Cash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622826775);
	});
	devProducts.Content.Body["12500Cash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622827106);
	});
	devProducts.Content.Body["100kCash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622827784);
	});
	devProducts.Content.Body["250kCash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622828375);
	});
	devProducts.Content.Body["500kCash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622828653);
	});
	devProducts.Content.Body["1mCash"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622829199);
	});
	devProducts.Content.Body["5m2x"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622821560);
	});
	devProducts.Content.Body["30m2x"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622829980);
	});
	devProducts.Content.Body["60m2x"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptProductPurchase(player, 1622830142);
	});
	overlay.OpenShop.MouseButton1Click.Connect(() => {
		devProducts.Visible = !devProducts.Visible;
		const { Gamepasses, Upgrades } = overlay;
		Gamepasses.Visible = false;
		Upgrades.Visible = false;
	});
}

function Gamepasses(overlay: NewOverlayGui) {
	const gamepasses = overlay.Gamepasses;
	gamepasses.Close.ImageButton.MouseButton1Click.Connect(() => {
		gamepasses.Visible = false;
	});
	gamepasses.Content.Body["2xMoney"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptGamePassPurchase(player, 240978094);
	});
	gamepasses.Content.Body["HigherLuck"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptGamePassPurchase(player, 240979761);
	});
	gamepasses.Content.Body["VIP"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptGamePassPurchase(player, 240981135);
	});
	gamepasses.Content.Body["FasterEmployee"].MouseButton1Click.Connect(() => {
		MarketplaceService.PromptGamePassPurchase(player, 240978991);
	});
	overlay.OpenPasses.MouseButton1Click.Connect(() => {
		gamepasses.Visible = !gamepasses.Visible;
		const { Upgrades, DevProducts } = overlay;
		Upgrades.Visible = false;
		DevProducts.Visible = false;
	});
}

function PlayerInfo(overlay: NewOverlayGui) {
	const playerInfo = overlay.PlayerInfo;
	playerInfo.Info.Username.Text.TextLabel.Text = player.Name;
	playerInfo.Info.Username.Text["TextLabel - Stroke"].Text = player.Name;
	const [image, success] = Players.GetUserThumbnailAsync(
		player.UserId,
		Enum.ThumbnailType.HeadShot,
		Enum.ThumbnailSize.Size420x420,
	);
	if (success) playerInfo.Info.ImageLabel.Image = image;
}

function Upgrades(overlay: NewOverlayGui) {
	const upgrades = overlay.Upgrades;
	upgrades.Close.ImageButton.MouseButton1Click.Connect(() => {
		upgrades.Visible = false;
	});
	overlay.OpenUpgrades.MouseButton1Click.Connect(() => {
		upgrades.Visible = !upgrades.Visible;
		const { Gamepasses, DevProducts } = overlay;
		Gamepasses.Visible = false;
		DevProducts.Visible = false;
	});
}

function guiFunctions() {
	const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
	const overlayGui = playerGui.FindFirstChild("Overlay") as NewOverlayGui;

	DevProducts(overlayGui);
	PlayerInfo(overlayGui);
	Gamepasses(overlayGui);
	Upgrades(overlayGui);
}

function setupGuiFunctions(soundtrack: Soundtrack) {
	const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
	const utilityInfo = playerGui.WaitForChild("UtilityInfo")! as UtilityInfoInstance;
	utilityInfo.Background.Upgrade.MouseButton1Click.Connect(() => {
		Network.upgradeUtility.client.fire(utilityInfo.Adornee! as Model);
	});

	guiFunctions();
}

function bootstrap() {
	withHookDetection(Roact);
	while (!state.playerId) {
		task.wait(0.1);
	}

	setupUtilityGui();
	setupSprinting();

	const soundtrack = setupSoundtrack();

	const money = (player as BasePlayer).Money;
	const update = (value?: number) => state.update("balance", value ?? money.Value);
	update();
	money.Changed.Connect((newValue) => {
		update(newValue);
	});

	setupGuiFunctions(soundtrack);

	Roact.mount(<Menu state={state} />, player.FindFirstChildOfClass("PlayerGui")!);

	Network.setState.client.connect((state) => {
		state = { ...state };
	});
}

bootstrap();
