import { DebugWidgets, World } from "@rbxts/matter";
import { Stats } from "@rbxts/services";

const startInstanceCount = Stats.InstanceCount;
const startMemory = Stats.GetTotalMemoryUsageMb();
const startTime = os.clock();

function trackMemory(_world: World, _state: object, ui: DebugWidgets) {
	const currentInstanceCount = Stats.InstanceCount;
	const currentMemory = Stats.GetTotalMemoryUsageMb();

	ui.window("Memory Stats", () => {
		ui.label(`Instance Count: ${currentInstanceCount - startInstanceCount}`);
		ui.label(`Gained Instances: ${currentInstanceCount - startInstanceCount}`);
		ui.label(`Memory Usage: ${string.format("%.1f", currentMemory)} MB`);
		ui.label(`Gained Memory: ${string.format("%.1f", currentMemory - startMemory)} MB`);
		ui.label(`Time: ${string.format("%.2f", os.clock() - startTime)} s`);
	});
}

export = trackMemory;
