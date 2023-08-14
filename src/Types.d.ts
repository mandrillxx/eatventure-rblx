interface Workspace extends Instance {
	Levels: Folder & {
		[key: string]: BaseLevel;
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
	Products: Folder & {
		Coffee: Product;
	};
};

type Levels = {
	Level1: BaseLevel;
};

type Customers = {
	Erik: NPCCustomer;
	Kendra: NPCCustomer;
	Sophia: NPCCustomer;
};

type Employees = {
	Kenny: NPCEmployee;
};

type CustomerNames = keyof Customers;
type EmployeeNames = keyof Employees;
type NPCNames = CustomerNames | EmployeeNames;

type NPCType = "employee" | "customer";

type BaseNPC = import("@rbxts/promise-character").CharacterRigR15 & {
	ID: IntValue;
};

type WorldInfo = Partial<import("@rbxts/matter").World> & {
	LevelModel: BaseLevel;
	Level: import("./shared/components/level").Level;
};

type NPCEmployee = BaseNPC & {
	ClickDetector: ClickDetector;
};

type NPCCustomer = BaseNPC & {
	ClickDetector: ClickDetector;
};

type Urgency = "low" | "medium" | "high";

type Product = Model & {
	icon: StringValue;
	price: NumberValue;
	name: StringValue;
};

type CustomerProduct =
	| Product
	| {
			icon: string;
			price: number;
			name: string;
	  };

type CustomerObjective = "purchase" | "steal";

type EmployeeObjective = "fulfill" | "idle";

type Objective = CustomerObjective | EmployeeObjective;

type BaseDirective = {
	urgency: Urgency;
};

type CustomerDirective = BaseDirective & {
	objective: CustomerObjective;
	wants: CustomerProduct;
};

type EmployeeDirective = BaseDirective & {
	objective: EmployeeObjective;
	destination: Vector3 | undefined;
};

type Directive = CustomerDirective | EmployeeDirective;

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

type NPC = {
	directive: Directive;
	npc: BaseNPC;
};

type Customer = NPC & {
	directive: CustomerDirective;
	npc: NPCCustomer;
};

type Employee = NPC & {
	directive: EmployeeDirective;
	npc: NPCEmployee;
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
	Products: Folder;
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
