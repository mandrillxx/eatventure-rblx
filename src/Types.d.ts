interface Workspace extends Instance {
	Levels: Folder & {
		[key: string]: BaseLevel;
	};
	NPCs: Folder & {
		[key: string]: BaseNPC;
	};
}

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
		tests: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
	Assets: Assets;
}

type SettingsGuiInstance = ImageLabel & {
	Accept: ImageButton;
	Close: ImageButton;
	Decline: ImageButton;
	Frame: SettingsFrame;
	Gear: ImageLabel;
	Title: TextLabel;
};

interface PlayerGui extends Instance {
	Overlay: OverlayGui;
}

interface StarterGui extends Instance {
	Overlay: OverlayGui;
}

interface SoundService extends Instance {
	Soundtrack: SoundGroup;
	SoundFX: SoundGroup;
}

type OverlayGui = ScreenGui & {
	PlaylistControls: Frame & {
		Frame: Frame & {
			Rewind: ImageButton;
			PlayPause: ImageButton;
			Skip: ImageButton;
		};
		Close: ImageButton;
	};
	OpenPlaylist: ImageButton;
	OpenSettings: ImageButton;
	OpenShop: ImageButton;
	OpenUpgrades: OpenUpgradesInstance;
	Settings: SettingsGuiInstance;
};

type SliderGui = Frame & {
	UIListLayout: UIListLayout;
	Holder: Frame & {
		Amount: IntValue;
		SliderScript: ModuleScript;
		Background: Frame & {
			Unselected: ImageLabel;
			Selected: ImageLabel;
		};
		Slider: ImageLabel;
	};
	Title: TextLabel;
};

type SettingsFrame = Frame & {
	UIListLayout: UIListLayout;
	Music: SliderGui;
	SoundFX: SliderGui;
	Title: TextLabel;
};

type EmployeesFolder = Folder & Employees;
type CustomersFolder = Folder & Customers;

type Sounds = {
	UIClick: Sound;
	MoneyPickup: Sound;
	Upgrade: Sound;
	Fail: Sound;
};

type Assets = Folder & {
	NPCs: Folder & EmployeesFolder & CustomersFolder;
	Levels: Folder & Levels;
	Sounds: Folder & Sounds;
	Products: Folder;
	Progress: RadialInstance;
	UtilityInfo: UtilityInfoInstance;
	UpgradeInfo: UpgradeInfoInstance;
	UpgradeGui: UpgradeGuiInstance;
	Animate: Script;
};

type RadialInstance = Frame & {
	Frame1: Frame & {
		ImageLabel: ImageLabel & {
			UIGradient: UIGradient;
		};
	};
	Frame2: Frame & {
		ImageLabel: ImageLabel & {
			UIGradient: UIGradient;
		};
	};
};

type BaseUpgrade = Frame & {
	UICorner: UICorner;
	UIPadding: UIPadding;
	Purchase: TextButton & {
		UICorner: UICorner;
	};
	ImageLabel: ImageLabel;
	Title: TextLabel;
	Description: TextLabel;
};

type UpgradeGuiInstance = BillboardGui & {
	UpgradeFrame: Frame & {
		UICorner: UICorner;
		UIPadding: UIPadding;
		ImageLabel: ImageLabel;
	};
};

type OpenUpgradesInstance = ImageButton & {
	TextLabel: TextLabel & {
		UICorner: UICorner;
	};
};

type UpgradeInfoInstance = ScreenGui & {
	UpgradeFrame: Frame & {
		UICorner: UICorner;
		UIPadding: UIPadding;
		Upgrades: ScrollingFrame & {
			UICorner: UICorner;
			UIListLayout: UIListLayout;
			BaseUpgrade: BaseUpgrade;
		};
		Close: TextButton & {
			UICorner: UICorner;
		};
		Title: TextLabel;
	};
};

type UtilityInfoInstance = BillboardGui & {
	Background: Frame & {
		UICorner: UICorner;
		Progress: CanvasGroup & {
			UICorner: UICorner;
			Unlocked: Frame & {
				UICorner: UICorner;
			};
		};
		Upgrade: TextButton & {
			UICorner: UICorner;
			UIPadding: UIPadding;
		};
		Level: TextLabel & {
			UIPadding: UIPadding;
		};
		Every: TextLabel & {
			UIPadding: UIPadding;
		};
		Min: TextLabel & {
			UIPadding: UIPadding;
		};
		Max: TextLabel & {
			UIPadding: UIPadding;
		};
		Type: TextLabel & {
			UIPadding: UIPadding;
		};
		Reward: TextLabel & {
			UIPadding: UIPadding;
		};
	};
};

type BaseUtility = Model & {
	SelectionBox: SelectionBox;
	ClickDetector: ClickDetector;
	Makes: StringValue;
	Amount: IntValue;
	Every: IntValue;
	OrderDelay: IntValue;
	Reward: NumberValue;
	BaseUpgrade: NumberValue;
	UpgradeGui: UpgradeGuiInstance;
};

type Levels = {
	Level1: BaseLevel;
};

type NPC = import("@rbxts/promise-character").CharacterRigR15 & {
	ID: IntValue;
};

type Customers = {
	Customer1: NPC;
	Customer2: NPC;
	Customer3: NPC;
	Customer4: NPC;
	Customer5: NPC;
	Customer6: NPC;
	Customer7: NPC;
	Customer8: NPC;
	Customer9: NPC;
};

type Employees = {
	Employee1: NPC;
	Employee2: NPC;
	Employee3: NPC;
	Employee4: NPC;
	Employee5: NPC;
	Employee6: NPC;
};

type CustomerNames = keyof Customers;
type EmployeeNames = keyof Employees;
type NPCNames = CustomerNames | EmployeeNames;

type NPCType = "employee" | "customer";

type BaseNPC = import("@rbxts/promise-character").CharacterRigR15 & {
	ID: IntValue;
	Gender: StringValue;
	DialogGui: BillboardGui & {
		DialogFrame: Frame & {
			UIPadding: UIPadding;
			DialogText: TextLabel & {
				UICorner: UICorner;
				UIPadding: UIPadding;
			};
			ImageLabel: ImageLabel;
		};
		Progress: RadialInstance;
	};
	ClickDetector: ClickDetector;
	HoverSelection: SelectionBox;
};

type BaseProduct = Model & {
	icon: StringValue;
	price: NumberValue;
	name: StringValue;
};

type AnimationType =
	| "cheer"
	| "climb"
	| "dance"
	| "dance2"
	| "dance3"
	| "fall"
	| "idle"
	| "jump"
	| "laugh"
	| "mood"
	| "point"
	| "run"
	| "sit"
	| "swim"
	| "swimidle"
	| "toollunge"
	| "toolnone"
	| "toolslash"
	| "walk"
	| "wave";

type ComputedAnchorPoint = Model & {
	[key: string]: BasePart & {
		Attachment: Attachment;
	};
};

type BaseLevel = Model & {
	NPCs: Folder & {
		Customers: Folder;
		Employees: Folder;
	};
	Utilities: Folder & {
		[key: string]: BaseUtility;
	};
	CustomerAnchors: Folder & {
		Spawn: ComputedAnchorPoint;
		Wait: ComputedAnchorPoint;
		[key: string]: ComputedAnchorPoint;
	};
	EmployeeAnchors: Folder & {
		Spawn: ComputedAnchorPoint;
		Wait: ComputedAnchorPoint;
		[key: string]: ComputedAnchorPoint;
	};
};

type BasePlayer = Player & {
	leaderstats: Folder & {
		Money: NumberValue;
	};
	Utilities: Folder & {
		[utilName: string]: IntValue;
	};
};
