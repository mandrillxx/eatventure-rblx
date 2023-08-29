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
		description: "+25% Order speed", // 3
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
		description: "+25% Employee pace",
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
		description: "+25% Employee pace",
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
		description: "Tacos profit x2",
		image: "rbxassetid://14567686090",
		cost: 50_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
			machine: "Microwave",
		},
	}),
	Upgrade({
		identifier: 11,
		type: "UpdateProfit",
		title: "Word got out",
		description: "+25% Customer spawn rate",
		image: "rbxassetid://14594410499",
		cost: 150_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 12,
		type: "UpdateWorkRate",
		title: "Improved training methods",
		description: "+15% Order Speed",
		image: "rbxassetid://14585348729",
		cost: 250_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1.15,
		},
	}),
	Upgrade({
		identifier: 13,
		type: "NewCustomer",
		title: "Social media viral",
		description: "+2 Customers",
		image: "rbxassetid://14585335797",
		cost: 1_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 14,
		type: "NewCustomer",
		title: "Social media viral",
		description: "+2 Customers",
		image: "rbxassetid://14567686511",
		cost: 3_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 15,
		type: "NewEmployee",
		title: "Extra backup",
		description: "+1 Employee",
		image: "rbxassetid://14567686511",
		cost: 10_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 16,
		type: "UpdateEventRate",
		title: "Streamlined",
		description: "+50% Order taking speed",
		image: "rbxassetid://14599359858",
		cost: 25_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 17,
		type: "NewCustomer",
		title: "Michelin star",
		description: "+2 Customers",
		image: "rbxassetid://14608770673",
		cost: 100_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
	Upgrade({
		identifier: 18,
		type: "EmployeePace",
		title: "Sticky floors",
		description: "+25% Employee pace",
		image: "rbxassetid://14608772379",
		cost: 1_000_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 1.25,
		},
	}),
	Upgrade({
		identifier: 19,
		type: "UpdateEventRate",
		title: "Overtime",
		description: "+50% Order taking speed",
		image: "rbxassetid://14608770673",
		cost: 100_000_000_000,
		purchased: false,
		ran: false,
		document: {
			amount: 2,
		},
	}),
];
