import { World } from "@rbxts/matter";
import { match } from "@rbxts/variant";
import { ClientState } from "shared/clientState";

let lastDashed = os.clock();
function sprintDash(_: World, client: ClientState): void {
	if (client.lastProcessedCommand) {
		match(client.lastProcessedCommand, {
			KeyDown: ({ key }) => {
				if (key === Enum.KeyCode.LeftShift) {
					client.isRunning = true;
				}
			},
			KeyUp: ({ key }) => {
				if (key === Enum.KeyCode.LeftShift) {
					client.isRunning = false;
				}
			},
			default: () => {},
		});
	}

	if (client.isRunning) {
		lastDashed = os.clock();
		client.character.Humanoid.WalkSpeed = 35;
		return;
	}

	client.character.Humanoid.WalkSpeed = 20;
}

export = {
	system: sprintDash,
	event: "fixed",
};
