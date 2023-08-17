<<<<<<< HEAD
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import { World } from "@rbxts/matter";
import { PhysicsService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { Body, Customer, Employee, NPC, Renderable } from "shared/components";
=======
import { Body, Customer, Employee, NPC, Renderable } from "shared/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { World } from "@rbxts/matter";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
>>>>>>> 4429656 (add: gui state)

function npc(world: World, _: ServerState) {
	for (const [id, npc] of world.query(NPC).without(Body)) {
		let bodyModel = ReplicatedStorage.Assets.NPCs.FindFirstChild(npc.name) as BaseNPC;
		if (!bodyModel) {
			Log.Error("NPC {@NPCName} does not have a representative asset", npc.name);
			continue;
		}

		bodyModel = bodyModel.Clone();
		bodyModel.ID.Value = id;
		New("BillboardGui")({
			Parent: bodyModel,
			Adornee: bodyModel.HumanoidRootPart,
			AlwaysOnTop: true,
			Enabled: false,
			Active: true,
			Size: new UDim2(1, 100, 0.5, 0),
			StudsOffsetWorldSpace: new Vector3(0, 3, 0),
			Name: "DialogGui",
		});
		New("Frame")({
			Parent: bodyModel.DialogGui,
			Name: "DialogFrame",
			Size: new UDim2(1, 0, 1, 0),
		});
		New("UIPadding")({
			Parent: bodyModel.DialogGui.DialogFrame,
			PaddingBottom: new UDim(0.1, 0),
			PaddingLeft: new UDim(0.1, 0),
			PaddingRight: new UDim(0.1, 0),
			PaddingTop: new UDim(0.1, 0),
		});
		New("TextButton")({
			Parent: bodyModel.DialogGui.DialogFrame,
			Name: "DialogText",
			Size: new UDim2(1, 0, 1, 0),
			FontFace: new Font("SourceSans", Enum.FontWeight.SemiBold),
			TextScaled: true,
			Text: "",
		});
		New("ClickDetector")({
			Parent: bodyModel,
			MaxActivationDistance: 32,
		});
		New("SelectionBox")({
			Parent: bodyModel,
			Name: "HoverSelection",
			Color3: new Color3(0, 255, 127),
			SurfaceColor3: new Color3(0, 255, 127),
			SurfaceTransparency: 0.8,
			Transparency: 0.8,
			LineThickness: 0.05,
			Adornee: bodyModel,
			Visible: false,
		});
		bodyModel.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.Viewer;
		bodyModel.Parent = Workspace.NPCs;

		const setNPCCollisionGroup = () => {
			for (const v of bodyModel.GetDescendants()) {
				if (v.IsA("BasePart")) {
					v.CollisionGroup = "NPCs";
				}
			}
		};
		setNPCCollisionGroup();

		const employeeOrCustomer = npc.type === "employee" ? Employee() : Customer({ servedBy: undefined });
		world.insert(
			id,
			Body({
				model: bodyModel,
			}),
			Renderable({
				model: bodyModel,
			}),
			employeeOrCustomer,
		);
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (npc.old && !npc.new) {
			if (world.contains(id)) world.remove(id);
		}
	}

	for (const [_id, body] of world.queryChanged(Body)) {
		if (body.old && body.old.model && !body.new) {
			body.old.model.Destroy();
		}
	}
}

export = npc;
