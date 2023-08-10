import { component } from "@rbxts/matter";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { EmployeeType, CustomerType } from "shared/Types";

export const Activated = component<{}>("Activated");
export type Activated = ReturnType<typeof Activated>;

export const Client = component<{
	player: Player;
	lineSight: Vector3;
	document: {
		rewardsMultiplier: number;
		bonusMultiplier?: number;
	};
}>("Client");
export type Client = ReturnType<typeof Client>;

export const Employee = component<{
	employeeId: number;
	employeeType: EmployeeType;
}>("Employee");
export type Employee = ReturnType<typeof Employee>;

export const Customer = component<{
	customerId: number;
	customerType: CustomerType;
}>("Customer");
export type Customer = ReturnType<typeof Customer>;

export const Body = component<{ model: CharacterRigR15 }>();
export type Body = ReturnType<typeof Body>;

export const DebugAdornment = component<{
	label: BillboardGui & { TextLabel: TextLabel };
	highlight: Highlight;
	lineBox: ScreenGui & { topLeft: Frame; topRight: Frame; bottomLeft: Frame; bottomRight: Frame };
	lineSight: Part;
}>("DebugAdornment");
export type DebugAdornment = ReturnType<typeof DebugAdornment>;

export const Interactable = component<{}>("Interactable");
export type Interactable = ReturnType<typeof Interactable>;

export const Prompt = component<{ prompt: ProximityPrompt }>("Prompt");
export type Prompt = ReturnType<typeof Prompt>;

export const Renderable = component<{ model: Model; doNotDestroy?: boolean }>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{ cf: CFrame; doNotReconcile?: boolean }>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Zone = component<{ maxCapacity: number; population: number }>("Zone");
export type Zone = ReturnType<typeof Zone>;
