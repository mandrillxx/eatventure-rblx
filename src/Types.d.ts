interface Workspace extends Instance {}

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
	CustomerNPC: NPCCustomer;
};

type NPCType = "employee" | "customer";

type BaseNPC = Model & {
	Humanoid: Humanoid;
};

type NPCEmployee = BaseNPC & {
	ClickDetector: ClickDetector;
};

type NPCCustomer = BaseNPC & {
	ClickDetector: ClickDetector;
};

type Urgency = "low" | "medium" | "high";

type CustomerProduct =
	| (Model & {
			icon: StringValue;
			price: NumberValue;
			name: StringValue;
	  })
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
	destination: Vector3;
};

type Directive = CustomerDirective | EmployeeDirective;

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

type Level = Model & {
	NPCs: Folder & {
		Customers: Folder & {};
	};
};
