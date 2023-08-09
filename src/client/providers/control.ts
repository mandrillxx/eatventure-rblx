import { Provider } from "@rbxts/proton";
import { UserInputService } from "@rbxts/services";

@Provider()
export class ControlProvider {
	private readonly clientKeybinds = new Map<string, RBXScriptConnection>();

	registerClientKeybind(name: string, key: Enum.KeyCode, callback: Callback) {
		this.clientKeybinds.set(
			name,
			UserInputService.InputBegan.Connect((input) => {
				if (input.KeyCode === key) {
					callback();
				}
			}),
		);
	}

	unregisterKeybinds() {
		this.clientKeybinds.forEach((connection) => connection.Disconnect());
	}
}
