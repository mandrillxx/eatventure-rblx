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

type Assets = Folder & {
	NPCs: Folder & Employees & Customers;
	Levels: Folder & Levels;
	Products: Folder & Products;
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

type BaseLevel = Model & {
	NPCs: Folder & {
		Customers: Folder;
		Employees: Folder;
	};
	Upgrades: Folder & {
		[key: string]: Model & {
			anchor: BasePart;
		};
	};
	Products: Folder & Products;
	CustomerAnchors: Folder & {
		Spawn: BasePart;
		[key: string]: BasePart & {
			Occupied?: IntValue;
		};
	};
	EmployeeAnchors: Folder & {
		Spawn: BasePart;
		[key: string]: BasePart & {
			Occupied?: IntValue;
		};
	};
};
