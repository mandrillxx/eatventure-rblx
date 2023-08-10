import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { BaseComponent, Component } from "@rbxts/proton";
import { ReplicatedStorage } from "@rbxts/services";

@Component({ tag: "Level" })
class LevelComponent extends BaseComponent<Level> {
	private employees = new Map<number, Employee>();
	private customers = new Map<number, Customer>();
	private maid = new Maid();

	onStart() {
		Log.Info(`Level ${this.instance.Name} started}`);
	}

	onStop() {
		this.maid.DoCleaning();
	}

	spawnCustomer(customer: NPCCustomer, id?: number) {
		const customerId = id || this.customers.size() + 1;
		const customerNpc: Customer = {
			directive: {
				urgency: "low",
				objective: "purchase",
				wants: ReplicatedStorage.Assets.Products.Coffee,
			},
			npc: customer,
		};
		customerNpc.npc.ID.Value = customerId;
		this.maid.GiveTask(customer);
	}

	removeCustomer(id: number) {
		const customer = this.customers.get(id);
		if (!customer) {
			Log.Warn(`Customer with id ${id} does not exist, cannot remove`);
			return;
		}
		if (this.customers.delete(id)) {
			Log.Info(`Customer with id ${id} removed successfully`);
			customer.npc.Destroy();
		}
	}

	spawnEmployee(employee: NPCEmployee, id?: number) {
		const employeeId = id || this.employees.size() + 1;
		const employeeNpc: Employee = {
			directive: {
				urgency: "low",
				objective: "idle",
				destination: undefined,
			},
			npc: employee,
		};
		employeeNpc.npc.ID.Value = employeeId;
		this.maid.GiveTask(employee);
	}

	removeEmployee(id: number) {
		const employee = this.employees.get(id);
		if (!employee) {
			Log.Warn(`Employee with id ${id} does not exist, cannot remove`);
			return;
		}
		if (this.employees.delete(id)) {
			Log.Info(`Employee with id ${id} removed successfully`);
			employee.npc.Destroy();
		}
	}
}
