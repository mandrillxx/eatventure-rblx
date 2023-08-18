import { BelongsTo, Body, Customer, Employee, NPC, Pathfind, Renderable } from "shared/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { World } from "@rbxts/matter";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";

function npc(world: World, _: ServerState) {
	for (const [id, npc, belongsTo] of world.query(NPC, BelongsTo).without(Body)) {
		let bodyModel = ReplicatedStorage.Assets.NPCs.FindFirstChild(npc.name) as BaseNPC;
		const levelModel = world.get(belongsTo.levelId, Renderable)!.model as BaseLevel;
		if (!bodyModel) {
			Log.Error("NPC {@NPCName} does not have a representative asset", npc.name);
			continue;
		}

		const employee = npc.type === "employee";
		if (employee) bodyModel.Humanoid.WalkSpeed = belongsTo.level.employeePace;
		bodyModel = bodyModel.Clone();
		bodyModel.ID.Value = id;
		New("BillboardGui")({
			Parent: bodyModel,
			Adornee: bodyModel.HumanoidRootPart,
			AlwaysOnTop: true,
			Enabled: true,
			Size: new UDim2(employee ? 1 : 4, 0, 1, 0),
			SizeOffset: new Vector2(0, 2.5),
			ZIndexBehavior: Enum.ZIndexBehavior.Global,
			Name: "DialogGui",
		});
		const progressFrame = ReplicatedStorage.Shared.Progress.Clone();
		progressFrame.Visible = false;
		progressFrame.Parent = bodyModel.DialogGui;
		New("Frame")({
			Parent: bodyModel.DialogGui,
			Name: "DialogFrame",
			Visible: false,
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
		bodyModel.PivotTo(
			employee
				? levelModel.EmployeeAnchors.Spawn.PrimaryPart!.CFrame
				: levelModel.CustomerAnchors.Spawn.PrimaryPart!.CFrame,
		);
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
		const destination = belongsTo.level.nextAvailableDestination(npc.type);
		if (destination) {
			world.insert(destination.destinationId, destination.destination.patch({ occupiedBy: id }));
		}

		world.insert(
			id,
			Body({
				model: bodyModel,
			}),
			Renderable({
				model: bodyModel,
			}),
			Pathfind({
				destination:
					destination?.destination.destination ??
					(employee
						? levelModel.EmployeeAnchors.Wait.PrimaryPart!.Position
						: levelModel.CustomerAnchors.Wait.PrimaryPart!.Position),
				running: false,
			}),
			employeeOrCustomer,
		);
	}

	for (const [id, npc] of world.queryChanged(NPC)) {
		if (npc.old && !npc.new) {
			if (world.contains(id)) world.despawn(id);
		}
	}

	for (const [_id, body] of world.queryChanged(Body)) {
		if (body.old && body.old.model && !body.new) {
			body.old.model.Destroy();
		}
	}
}

export = npc;
