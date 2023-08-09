import { RunService } from "@rbxts/services";
import TestEZ from "@rbxts/testez";

export function testBootStrapper(tests: Array<Instance>) {
	if (RunService.IsStudio()) {
		TestEZ.TestBootstrap.run(tests);
	}
}
