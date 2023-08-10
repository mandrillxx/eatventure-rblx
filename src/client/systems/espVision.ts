import { World, useThrottle } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { CharacterRigR15 } from "@rbxts/promise-character";
import * as Components from "shared/components";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import cloneTemplate from "client/cloneTemplate";
import { createLineBox, updateLineBox } from "client/linebox";
import { ClientState } from "shared/clientState";
import { Client, DebugAdornment, Renderable } from "shared/components";

const camera = Workspace.CurrentCamera!;
const remoteEvent = ReplicatedStorage.WaitForChild("TrackLineOfSight") as RemoteEvent;

const raycastParams = new RaycastParams();
raycastParams.FilterType = Enum.RaycastFilterType.Blacklist;

function espVision(world: World, state: ClientState, ui: Widgets): void {
	const transparency = ui.slider(1);

	if (!state.debugEnabled) {
		for (const [id, debugAdornment] of world.query(DebugAdornment)) {
			debugAdornment.label.Destroy();
			debugAdornment.highlight.Destroy();
			debugAdornment.lineBox.Destroy();
			debugAdornment.lineSight.Destroy();
			world.remove(id, DebugAdornment);
		}
		return;
	}

	for (const [, debugAdornmentRecord] of world.queryChanged(DebugAdornment)) {
		if (debugAdornmentRecord.new === undefined) {
			if (debugAdornmentRecord.old) {
				const debugAdornment = debugAdornmentRecord.old;
				debugAdornment.highlight.Destroy();
				debugAdornment.label.Destroy();
				debugAdornment.lineBox.Destroy();
				debugAdornment.lineSight.Destroy();
			}
		}
	}

	for (const [id, renderable, client] of world.query(Renderable, Client)) {
		if (client.player === Players.LocalPlayer) continue;

		const model = renderable.model as CharacterRigR15;
		let debugAdornment = world.get(id, DebugAdornment);

		if (!debugAdornment) {
			const label = cloneTemplate();
			label.Adornee = model;
			label.Parent = model;

			const highlight = new Instance("Highlight");
			highlight.Parent = model;
			highlight.Adornee = model;
			highlight.FillTransparency = 1;
			highlight.OutlineColor = Color3.fromRGB(255, 0, 0);

			const lineBox = createLineBox();
			lineBox.Parent = Players.LocalPlayer.FindFirstChild("PlayerGui")!;

			const lineSight = new Instance("Part");
			lineSight.Anchored = true;
			lineSight.CanCollide = false;
			lineSight.CanQuery = false;
			lineSight.CanTouch = false;
			lineSight.Parent = Workspace.Terrain;

			debugAdornment = DebugAdornment({ label, highlight, lineBox, lineSight });

			world.insert(id, debugAdornment);
		}

		let text = "Entity: " + id;
		text += "\n";

		for (const [name, component] of pairs(Components)) {
			const data = world.get(id, component);

			if (data !== undefined) {
				text += name + " {";

				if (next(data)[0] !== undefined) {
					for (const [key, val] of pairs(data as unknown as Map<never, never>)) {
						text += `\n  ${key}: ${tostring(val)}`;
					}

					text += "\n";
				}
				text += "}\n";
			}
		}

		if (debugAdornment) {
			debugAdornment.label.TextLabel.Text = text;
			debugAdornment.label.TextLabel.TextTransparency = transparency;

			debugAdornment.highlight.OutlineTransparency = transparency;

			const [from, to] = [model.Head.Position, client.lineSight];

			debugAdornment.lineSight.CFrame = new CFrame(from.add(to).div(2), to);
			debugAdornment.lineSight.Size = new Vector3(0.1, 0.1, to.sub(from).Magnitude);
			debugAdornment.lineSight.Transparency = transparency;
			debugAdornment.lineSight.Color = Color3.fromRGB(255, 0, 0);

			updateLineBox(
				debugAdornment.lineBox,
				model.GetPivot().sub(new Vector3(0, 0.5)),
				new Vector3(2, 0.5 * model.HumanoidRootPart.Size.Y + model.Humanoid.HipHeight, 0),
				Color3.fromRGB(255, 0, 0),
				transparency,
			);
		}
	}

	raycastParams.FilterDescendantsInstances = [state.character];

	const cf = state.character.GetPivot();
	const result = Workspace.Raycast(cf.Position, camera.CFrame.LookVector.mul(500), raycastParams);

	if (useThrottle(0.03)) {
		if (result && result.Position) {
			remoteEvent.FireServer(result.Position);
		} else {
			remoteEvent.FireServer(camera.CFrame.LookVector.mul(500));
		}
	}
}

export = {
	event: "fixed",
	system: espVision,
};
