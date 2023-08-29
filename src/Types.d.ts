interface Workspace extends Instance {
	Levels: Folder & {
		[key: string]: BaseLevel;
	};
	NPCs: Folder & {
		[key: string]: BaseNPC;
	};
	Plots: Folder & {
		Plot1: Part;
		Plot2: Part;
		Plot3: Part;
		Plot4: Part;
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

type NewOverlayGui = ScreenGui & {
	DevProducts: DevProductsFrame;
	Gamepasses: GamepassesFrame;
	Renovate: RenovateFrame;
	PlayerInfo: PlayerInfoFrame;
	Upgrades: UpgradesFrame;
	Settings: SettingsFrame;
	OpenSettings: TextButton;
	OpenShop: TextButton;
	OpenPasses: TextButton;
	OpenUpgrades: TextButton;
	OpenRenovate: TextButton;
};

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
	Close: Frame & {
		ImageButton: ImageButton;
	};
	Content: Frame & {
		Body: Frame & {
			CloseStore: ImageButton;
			OpenStore: ImageButton;
			Cash: Frame & {
				Text: Frame & UIText;
				Extras: Frame & {
					Button: Frame & {
						ImageButton: ImageButton;
					};
				};
			};
			Gems: Frame & {
				Text: Frame & UIText;
				Extras: Frame & {
					Button: Frame & {
						ImageButton: ImageButton;
					};
				};
			};
			Music: Frame & {
				Holder: Frame & {
					Amount: IntValue;
				};
			};
			PlaylistControls: Frame & {
				Skip: ImageButton;
				PlayPause: ImageButton & {
					BtnImage: Frame & {
						ImageLabel: ImageLabel;
					};
				};
				Rewind: ImageButton;
			};
			SoundFX: Frame & {
				Holder: Frame & {
					Amount: IntValue;
				};
			};
		};
	};
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

type BasePlot = Part & {
	Attachment: Attachment;
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
	Weight: IntValue;
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
	Settings: Folder & {
		PrestigeCost: NumberValue;
	};
};

type BasePlayer = Player & {
	leaderstats: Folder & {
		Money: StringValue;
	};
	Money: NumberValue;
	Utilities: Folder & {
		[utilName: string]: IntValue;
	};
};

type DevProductsFrame = Frame & {
	Content: Frame & {
		Body: Frame & {
			["1000Cash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["5000Cash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["12500Cash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["100kCash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["250kCash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["500kCash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["1mCash"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["5m2x"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["30m2x"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			["60m2x"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
		};
	};
	Close: Frame & {
		ImageButton: ImageButton;
	};
};

type RenovateFrame = Frame & {
	Content: Frame & {
		Footer: Frame & {
			NotReady: TextButton;
			CantAfford: TextButton & {
				BtnText: Frame & UIText;
			};
			Purchase: TextButton & {
				BtnText: Frame & UIText;
			};
			Decline: TextButton;
		};
	};
	Close: Frame & {
		ImageButton: ImageButton;
	};
};

type GamepassesFrame = Frame & {
	Content: Frame & {
		Body: Frame & {
			["2xMoney"]: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			HigherLuck: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			VIP: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
			FasterEmployee: TextButton & {
				Content: Frame & {
					Button: Frame & {
						TextButton: TextButton;
					};
				};
			};
		};
	};
	Close: Frame & {
		ImageButton: ImageButton;
	};
};

type UIText = {
	TextLabel: TextLabel;
	["TextLabel - Stroke"]: TextLabel;
};

type BaseGuiUpgrade = Frame & {
	Content: Frame & {
		Title: Frame & {
			Text: Frame & UIText;
		};
		Description: Frame & {
			Text: Frame & UIText;
		};
		AlreadyOwn: ImageButton & {
			BtnImage: Frame & {
				Text: Frame & UIText;
			};
		};
		CantAfford: ImageButton & {
			BtnImage: Frame & {
				Text: Frame & UIText;
			};
		};
		Purchase: ImageButton & {
			BtnImage: Frame & {
				Text: Frame & UIText;
			};
		};
		ImageLabel: ImageLabel;
	};
};

type UpgradesFrame = Frame & {
	Content: Frame & {
		Body: Frame & {
			BaseUpgrade: BaseGuiUpgrade;
		};
	};
	Close: Frame & {
		ImageButton: ImageButton;
	};
};

type PlayerInfoFrame = Frame & {
	Bars: Frame & {
		Progress: Frame & {
			Cash: Frame & {
				Text: Frame & UIText;
			};
			Gems: Frame & {
				Text: Frame & UIText;
			};
		};
	};
	Info: Frame & {
		Username: Frame & {
			Text: Frame & UIText;
		};
		Counter: ImageLabel & {
			Text: Frame & UIText;
		};
		ImageLabel: ImageLabel;
	};
};
