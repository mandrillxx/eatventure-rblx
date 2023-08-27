import { Upgrade } from "./components";

export type UpgradeType = "NewCustomer" | "NewEmployee" | "EmployeePace" | "UpdateProfit" | "UpdateWorkRate";

export const Upgrades: Upgrade[] = [
	Upgrade({
		identifier: 1,
		type: "NewCustomer",
		title: "Text your friends",
		description: "+1 Customer", // 3
		cost: 10,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 2,
		type: "NewEmployee",
		title: "Hire a buddy",
		description: "+1 Employee", // 2
		cost: 25,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 3,
		type: "NewCustomer",
		title: "Post on social media",
		description: "+1 Customer", // 4
		cost: 100,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 4,
		type: "UpdateWorkRate",
		title: "High work motives",
		description: "-25% time to take order", // 3
		cost: 1_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1.25,
		},
	}),
	Upgrade({
		identifier: 5,
		type: "EmployeePace",
		title: "New shoes",
		description: "+25% Employee Pace",
		cost: 3_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1.25,
		},
	}),
	Upgrade({
		identifier: 6,
		type: "UpdateProfit",
		title: "Hire the muffin man",
		description: "Muffin profit x2",
		cost: 5_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
			machine: "ToasterOven",
		},
	}),
	Upgrade({
		identifier: 7,
		type: "NewEmployee",
		title: "Post a job ad",
		description: "+1 Employee", // 3
		cost: 10_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 8,
		type: "EmployeePace",
		title: "Employee training",
		description: "+25% Employee Pace",
		cost: 20_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1.25,
		},
	}),
	Upgrade({
		identifier: 9,
		type: "NewCustomer",
		title: "Randomly gain exposure",
		description: "+1 Customer", // 5
		cost: 30_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 10,
		type: "UpdateProfit",
		title: "Make in batches",
		description: "Fries profit x2",
		cost: 50_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
			machine: "DeepFryer",
		},
	}),
];
