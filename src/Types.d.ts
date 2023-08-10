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
	Employees: Folder & {
		Kenny: NPCEmployee;
	};
	Customers: Folder & {
		Erik: NPCCustomer;
		Kendra: NPCCustomer;
		Sophia: NPCCustomer;
	};
	Products: Folder & {
		Coffee: Product;
	};
};

type NPCType = "employee" | "customer";

type BaseNPC = Model & {
	ID: IntValue;
	LeftLowerArm: MeshPart & {
		LeftElbowRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftElbow: Motor6D;
		OriginalSize: Vector3Value;
		LeftWristRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	LeftFoot: MeshPart & {
		OriginalSize: Vector3Value;
		LeftAnkleRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftAnkle: Motor6D;
	};
	RightHand: MeshPart & {
		RightWristRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightWrist: Motor6D;
		RightGripAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
	};
	HumanoidRootPart: Part & {
		RootRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
	};
	RightLowerLeg: MeshPart & {
		RightKneeRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightAnkleRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightKnee: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftUpperLeg: MeshPart & {
		OriginalSize: Vector3Value;
		LeftHip: Motor6D;
		LeftHipRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftKneeRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	LeftLowerLeg: MeshPart & {
		OriginalSize: Vector3Value;
		LeftKnee: Motor6D;
		LeftAnkleRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftKneeRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	LowerTorso: MeshPart & {
		WaistCenterAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftHipRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		Root: Motor6D;
		RootRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightHipRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		WaistRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		WaistBackAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		WaistFrontAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	Head: Part & {
		HatAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		NeckRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		FaceFrontAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		face: Decal;
		HairAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		Neck: Motor6D;
		Mesh: SpecialMesh;
		FaceCenterAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	UpperTorso: MeshPart & {
		RightCollarAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		BodyBackAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		NeckRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftCollarAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		Waist: Motor6D;
		RightShoulderRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		BodyFrontAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		WaistRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftShoulderRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		NeckAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	LeftUpperArm: MeshPart & {
		LeftShoulderRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftShoulder: Motor6D;
		LeftShoulderAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		LeftElbowRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
	};
	RightLowerArm: MeshPart & {
		RightWristRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		RightElbow: Motor6D;
		RightElbowRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	LeftHand: MeshPart & {
		LeftWrist: Motor6D;
		LeftGripAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		LeftWristRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	Humanoid: Humanoid;
	RightUpperArm: MeshPart & {
		OriginalSize: Vector3Value;
		RightElbowRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightShoulderRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightShoulderAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightShoulder: Motor6D;
	};
	RightUpperLeg: MeshPart & {
		RightKneeRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		OriginalSize: Vector3Value;
		RightHip: Motor6D;
		RightHipRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
	};
	RightFoot: MeshPart & {
		RightAnkleRigAttachment: Attachment & {
			OriginalPosition: Vector3Value;
		};
		RightAnkle: Motor6D;
		OriginalSize: Vector3Value;
	};
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
