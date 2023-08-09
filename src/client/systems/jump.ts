import { World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { UserInputService } from "@rbxts/services";
import { ClientState } from "shared/clientState";

function jump(_: World, client: ClientState, ui: Widgets) {
	const transparency = ui.slider(1);

	if (UserInputService.TouchEnabled) {
		client.character.Humanoid.Jump = client.isJumping;
	} else {
		client.character.Humanoid.Jump = UserInputService.IsKeyDown(Enum.KeyCode.Space);
	}
}

export = jump;
