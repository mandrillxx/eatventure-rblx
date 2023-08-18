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
		Progress: RadialInstance;
	};
	Client: Folder & {
		systems: Folder;
	};
	Assets: Assets;
}

type Assets = Folder & {
	NPCs: Folder & Employees & Customers;
	Levels: Folder & Levels;
	Products: Folder & Products;
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
};

type Levels = {
	Level1: BaseLevel;
};

type NPC = import("@rbxts/promise-character").CharacterRigR15 & {
	ID: IntValue;
};

type Customers = {
	Erik: NPC;
	Kendra: NPC;
	Sophia: NPC;
};

type Employees = {
	Kenny: NPC;
};

type CustomerNames = keyof Customers;
type EmployeeNames = keyof Employees;
type NPCNames = CustomerNames | EmployeeNames;

type NPCType = "employee" | "customer";

type BaseNPC = import("@rbxts/promise-character").CharacterRigR15 & {
	ID: IntValue;
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
	[key: string]: BasePart;
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
