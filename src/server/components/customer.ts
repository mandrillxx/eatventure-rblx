import { BaseComponent, Component } from "@rbxts/proton";
import { ReplicatedStorage } from "@rbxts/services";

@Component({ tag: "Customer" })
class CustomerNPC extends BaseComponent<NPCCustomer> {
	private directive: CustomerDirective | undefined;

	onStart() {
		this.setDirective({
			wants: {
				icon: "rbxassetid://3926305904",
				name: "Coffee",
				price: 0,
			},
			objective: "purchase",
			urgency: "low",
		});
	}
	onStop() {}

	walkTo(position: Vector3) {
		this.instance.Humanoid.MoveTo(position);
	}

	setDirective(directive: CustomerDirective) {
		this.directive = directive;
	}
}
