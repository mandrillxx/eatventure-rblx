import { Upgrade } from "./components";

export type UpgradeType = "NewCustomer" | "NewEmployee" | "EmployeePace" | "UpdateProfit";

export const Upgrades: Upgrade[] = [
	Upgrade({
		identifier: 1,
		type: "NewCustomer",
		title: "Text your friends",
		description: "+1 Customer",
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
		description: "+1 Employee",
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
		description: "+1 Customer",
		cost: 100,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 4,
		type: "NewEmployee",
		title: "Post a job ad",
		description: "+1 Employee",
		cost: 1000,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 5,
		type: "EmployeePace",
		title: "New shoes",
		description: "+50% Employee Pace",
		cost: 3000,
		purchased: false,
		ran: false,
		document: {
			amount: 1,
		},
	}),
	Upgrade({
		identifier: 6,
		type: "UpdateProfit",
		title: "Make in batches",
		description: "Fries profit x3",
		cost: 5000,
		purchased: false,
		ran: false,
		document: {
			amount: 3,
			machine: "DeepFryer",
		},
	}),
];
