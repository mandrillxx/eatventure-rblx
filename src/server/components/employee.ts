import create from "@rbxts/objecat";
import { BaseComponent, Component } from "@rbxts/proton";
import { ReplicatedStorage } from "@rbxts/services";

@Component({ tag: "Employee" })
class EmployeeNPC extends BaseComponent<NPCEmployee> {
	private directive: EmployeeDirective | undefined;

	onStart() {
		if (this.instance.IsDescendantOf(ReplicatedStorage)) return;

		this.setDirective({
			destination: new Vector3(0, 0, 0),
			objective: "fulfill",
			urgency: "low",
		});
	}
	onStop() {}

	walkTo(position: Vector3) {
		this.instance.Humanoid.MoveTo(position);
	}

	setDirective(directive: EmployeeDirective) {
		this.directive = directive;
	}
}
