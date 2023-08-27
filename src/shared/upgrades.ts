import { Upgrade } from "./components";

export type UpgradeType =
	| "NewCustomer"
	| "NewEmployee"
	| "EmployeePace"
	| "UpdateProfit"
	| "UpdateWorkRate"
	| "UpdateEventRate";

export const Upgrades: Upgrade[] = [
	Upgrade({
		identifier: 1,
		type: "NewCustomer",
		title: "Text your friends",
		description: "+1 Customer", // 3
		image: "rbxassetid://14585335797",
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
		image: "rbxassetid://14585339769",
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
		image: "rbxassetid://14585344212",
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
		title: "High motives",
		description: "+25% Order Speed", // 3
		image: "rbxassetid://14585348729",
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
		image: "rbxassetid://14585351153",
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
		title: "Hire the tomatonator",
		description: "Tomato profit x2",
		image: "rbxassetid://14567683935",
		cost: 5_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
			machine: "TomatoStation",
		},
	}),
	Upgrade({
		identifier: 7,
		type: "NewEmployee",
		title: "Post a job ad",
		description: "+1 Employee", // 3
		image: "rbxassetid://14585356466",
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
		image: "rbxassetid://14585360633",
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
		image: "rbxassetid://14567386315",
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
		image: "rbxassetid://14567686090",
		cost: 50_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
			machine: "DeepFryer",
		},
	}),
	Upgrade({
		identifier: 11,
		type: "UpdateProfit",
		title: "Word got out",
		description: "Customers spawn faster",
		image: "rbxassetid://14594410499",
		cost: 150_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
];
