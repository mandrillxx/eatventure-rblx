import { Balance, BelongsTo, Upgrade } from "shared/components";
import { ComponentInfo, getOrError } from "shared/util";
import { ServerEntityIdToClient } from "client/methods";
import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { Players } from "@rbxts/services";
import Log from "@rbxts/log";

const player = Players.LocalPlayer;

function getAllUpgradesForPlayer(state: ClientState, world: World, playerId: AnyEntity) {
	const upgrades: ComponentInfo<typeof Upgrade>[] = [];
	for (const [id, upgrade, belongsTo] of world.query(Upgrade, BelongsTo)) {
		if (ServerEntityIdToClient(state, belongsTo.playerId) === playerId) {
			upgrades.push({ componentId: id, component: upgrade });
		}
	}

	return upgrades.sort((a, b) => a.component.cost <= b.component.cost);
}

function upgrade(world: World, state: ClientState) {
	for (const [id, upgrade] of world.queryChanged(Upgrade)) {
		if (!upgrade.old && upgrade.new) {
			state.upgrades.set(id, { componentId: id, component: upgrade.new });
		}
		if (upgrade.old && !upgrade.new) {
			state.upgrades.delete(id);
		}
		if (upgrade.new) {
			state.upgrades.set(id, { componentId: id, component: upgrade.new });
			const balance = getOrError(world, state.playerId!, Balance);
			const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
			const upgradeInfo = playerGui.FindFirstChild("UpgradeInfo")! as UpgradeInfoInstance;
			const baseUpgrade = upgradeInfo.UpgradeFrame.Upgrades.BaseUpgrade;

			for (const child of upgradeInfo.UpgradeFrame.Upgrades.GetChildren()) {
				if (child.IsA("Frame") && child.Name !== "BaseUpgrade") {
					child.Destroy();
				}
			}

			const allUpgrades = getAllUpgradesForPlayer(state, world, state.playerId!);
			allUpgrades.forEach((upgrade, index) => {
				Log.Info("Upgrade: {@Upgrade}", upgrade);
				const newUpgrade = baseUpgrade.Clone();
				newUpgrade.Visible = true;
				newUpgrade.Name = tostring(upgrade.componentId);
				newUpgrade.Purchase.Text = `$${FormatCompact(upgrade.component.cost, 0)}`;
				newUpgrade.Title.Text = upgrade.component.title;
				newUpgrade.Description.Text = upgrade.component.description;
				newUpgrade.Purchase.BackgroundColor3 =
					balance.balance >= upgrade.component.cost
						? Color3.fromRGB(66, 132, 255)
						: Color3.fromRGB(65, 65, 65);
				newUpgrade.Purchase.TextColor3 =
					balance.balance >= upgrade.component.cost
						? Color3.fromRGB(255, 255, 255)
						: Color3.fromRGB(255, 22, 14);
				newUpgrade.LayoutOrder = index;
				newUpgrade.Parent = upgradeInfo.UpgradeFrame.Upgrades;
				newUpgrade.SetAttribute("serverId", upgrade.componentId);
			});
		}
	}
}

export = upgrade;
