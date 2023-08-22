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

type EmployeesFolder = Folder & Employees;
type CustomersFolder = Folder & Customers;

type Assets = Folder & {
	NPCs: Folder & EmployeesFolder & CustomersFolder;
	Levels: Folder & Levels;
	Products: Folder & Products;
	Progress: RadialInstance;
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

type BaseUtility = Model & {
	SelectionBox: SelectionBox;
	ClickDetector: ClickDetector;
	Makes: StringValue;
	Amount: IntValue;
	Every: IntValue;
	OrderDelay: IntValue;
	Reward: NumberValue;
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
			DialogText: TextLabel;
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

type Products = {
	Coffee: BaseProduct;
	Bagel: BaseProduct;
	Tea: BaseProduct;
};

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
};
