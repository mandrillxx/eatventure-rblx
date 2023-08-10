import { GenericOfComponent } from "@rbxts/matter";
import * as Components from "shared/components";

export type ComponentNames = keyof typeof Components;

export type ComponentsMap = { [K in ComponentNames]: MappedComponentToName<K> };

export type MappedComponentToName<T extends ComponentNames> = GenericOfComponent<ReturnType<(typeof Components)[T]>>;
type UnionComponentsMap = ComponentsMap[ComponentNames];

export type EmployeeType = "cashier" | "chef" | "janitor";
export type CustomerType = "adult" | "child" | "rich" | "teenager" | "elderly" | "disabled" | "pregnant" | "celebrity";
