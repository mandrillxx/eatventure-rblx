import { Provider } from "@rbxts/proton";

@Provider()
export class StatsProvider {
	constructor() {}

	hello() {
		print("Hello from StatsProvider!");
	}
}
