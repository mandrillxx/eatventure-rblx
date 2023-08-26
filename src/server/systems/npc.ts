import { getOrError, npcMaleName, npcMaleNames, randomCustomerModel, randomEmployeeModel } from "shared/util";
import { BelongsTo, Body, Customer, Employee, Level, NPC, Renderable } from "shared/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerState } from "server/index.server";
import { World } from "@rbxts/matter";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";

function npc(world: World, state: ServerState) {
	for (const [id, npc, belongsTo] of world.query(NPC, BelongsTo).without(Body)) {
		const employee = npc.type === "employee";
		let bodyModel = ReplicatedStorage.Assets.NPCs.FindFirstChild(
			employee
				? randomEmployeeModel(npcMaleNames.includes(npc.name as unknown as npcMaleName) ? "Male" : "Female")
				: randomCustomerModel(npcMaleNames.includes(npc.name as unknown as npcMaleName) ? "Male" : "Female"),
		) as BaseNPC;
		const level = getOrError(world, belongsTo.levelId, Level, "Level {@LevelId} does not have a Level component");
		const levelRenderable = getOrError(
			world,
			belongsTo.levelId,
			Renderable,
			"Level {@LevelId} does not have renderable",
			"error",
			belongsTo.levelId,
		);
		const levelModel = levelRenderable.model as BaseLevel;

		bodyModel = bodyModel.Clone();
		bodyModel.ID.Value = id;
		New("BillboardGui")({
			Parent: bodyModel,
			Adornee: bodyModel.HumanoidRootPart,
			AlwaysOnTop: false,
			Enabled: true,
			Size: new UDim2(1.5, 0, 1.5, 0),
			SizeOffset: new Vector2(0, 2.5),
			ZIndexBehavior: Enum.ZIndexBehavior.Global,
			Name: "DialogGui",
		});
		const progressFrame = ReplicatedStorage.Assets.Progress.Clone();
		progressFrame.Visible = false;
		progressFrame.Parent = bodyModel.DialogGui;
		const DialogFrame = New("Frame")({
			Parent: bodyModel.DialogGui,
			Name: "DialogFrame",
			Visible: false,
			Size: new UDim2(1, 0, 1, 0),
		});
		New("UICorner")({
			Parent: DialogFrame,
			CornerRadius: new UDim(0.1, 0),
		});
		New("UIPadding")({
			Parent: DialogFrame,
			PaddingBottom: new UDim(0.1, 0),
			PaddingLeft: new UDim(0.1, 0),
			PaddingRight: new UDim(0.1, 0),
			PaddingTop: new UDim(0.1, 0),
		});
		New("ImageLabel")({
			BackgroundTransparency: 1,
			Parent: DialogFrame,
			Position: new UDim2(0, 0, 0, 0),
			Size: new UDim2(1, 0, 1, 0),
		});
		const DialogText = New("TextButton")({
			Parent: DialogFrame,
			Name: "DialogText",
			Position: new UDim2(0.525, 0, 0.5, 0),
			Size: new UDim2(0.5, 0, 0.5, 0),
			FontFace: new Font("SourceSans", Enum.FontWeight.SemiBold),
			TextScaled: true,
			ZIndex: 2,
			Text: "",
		});
		New("UICorner")({
			CornerRadius: new UDim(0.5, 0),
			Parent: DialogText,
		});
		New("UIPadding")({
			PaddingBottom: new UDim(0.1, 0),
			PaddingLeft: new UDim(0.1, 0),
			PaddingRight: new UDim(0.1, 0),
			PaddingTop: new UDim(0.1, 0),
			Parent: DialogText,
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
		const animateScript = ReplicatedStorage.Assets.Animate.Clone();
		animateScript.Parent = bodyModel;
		bodyModel.Name = npc.name;
		bodyModel.PivotTo(
			employee
				? levelModel.EmployeeAnchors.Spawn.PrimaryPart!.CFrame.add(new Vector3(0, 3, 0))
				: levelModel.CustomerAnchors.Spawn.PrimaryPart!.CFrame.add(new Vector3(0, 3, 0)),
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

		if (employee) {
			if (state.verbose)
				Log.Warn(
					"Employee {@EmployeeName} has been spawned, setting ws to {@WS}",
					npc.name,
					level.employeePace,
				);
			bodyModel.Humanoid.WalkSpeed = level.employeePace;
		}
		const employeeOrCustomer = npc.type === "employee" ? Employee() : Customer();
		world.insert(
			id,
			employeeOrCustomer,
			Body({
				model: bodyModel,
			}),
			Renderable({
				model: bodyModel,
			}),
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
