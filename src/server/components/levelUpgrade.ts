import { Balance, BelongsTo, Upgrade } from "shared/components";
import { ComponentInfo, getOrError } from "shared/util";
import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ServerState } from "server/index.server";
import Log from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { IProfile } from "server/data/PurchaseHandler";
import { ReplicatedStorage } from "@rbxts/services";

function getProfile(state: ServerState, player: Player) {
	const profile = state.profiles.get(player);
	if (!profile) {
		throw "Could not find profile for player";
	}
	return profile;
}

function getAllUpgradesForPlayer(world: World, playerId: AnyEntity) {
	const upgrades: ComponentInfo<typeof Upgrade>[] = [];
	for (const [id, upgrade, belongsTo] of world.query(Upgrade, BelongsTo)) {
		if (belongsTo.playerId === playerId) {
			upgrades.push({ componentId: id, component: upgrade });
		}
	}
	return upgrades;
}

function has(set: Set<number>, value: number) {
	for (const v of set) {
		if (tonumber(v) === tonumber(value)) return true;
	}
	return false;
}

export function saveUpgrade(
	world: World,
	playerId: AnyEntity,
	balance: Balance,
	profile: Profile<IProfile, unknown>,
	upgrade: ComponentInfo<typeof Upgrade>,
) {
	if (balance.balance < upgrade.component.cost) {
		Log.Warn(
			"Player {@PlayerId} tried to purchase upgrade {@UpgradeId} but did not have enough money",
			playerId,
			upgrade.componentId,
		);
		return;
	}
	world.insert(playerId, balance.patch({ balance: balance.balance - upgrade.component.cost }));
	world.insert(upgrade.componentId, upgrade.component.patch({ purchased: true }));
	if (!profile.Data.purchasedUpgrades.has(upgrade.component.identifier)) {
		profile.Data.purchasedUpgrades.add(upgrade.component.identifier);
	}
}

export function updateUpgrades({
	upgrades,
	world,
	playerId,
	profile,
	upgradeInfo,
	onUpgradeClicked,
}: {
	upgrades?: ComponentInfo<typeof Upgrade>[];
	world: World;
	playerId: AnyEntity;
	profile: Profile<IProfile, unknown>;
	upgradeInfo: UpgradeInfoInstance;
	onUpgradeClicked?: (upgrade: ComponentInfo<typeof Upgrade>) => void;
}) {
	const _upgrades = upgrades ?? getAllUpgradesForPlayer(world, playerId);
	const baseUpgrade = upgradeInfo.UpgradeFrame.Upgrades.BaseUpgrade;
	const balance = getOrError(world, playerId, Balance);
	for (const child of upgradeInfo.UpgradeFrame.Upgrades.GetChildren()) {
		if (child.IsA("Frame") && child.Name !== "BaseUpgrade") {
			child.Destroy();
		}
	}
	_upgrades
		.sort((a, b) => a.component.cost <= b.component.cost)
		.forEach((upgrade, index) => {
			const newUpgrade = baseUpgrade.Clone();
			const ownsUpgrade = has(profile.Data.purchasedUpgrades, upgrade.component.identifier);
			newUpgrade.Visible = true;
			newUpgrade.Name = tostring(upgrade.componentId);
			newUpgrade.Purchase.Text = `$${FormatCompact(upgrade.component.cost, 0)}`;
			newUpgrade.Title.Text = `${upgrade.component.title} ${ownsUpgrade ? "(Owned)" : ""}`;
			newUpgrade.Description.Text = upgrade.component.description;
			newUpgrade.Purchase.BackgroundColor3 =
				balance.balance >= upgrade.component.cost && !ownsUpgrade
					? Color3.fromRGB(66, 132, 255)
					: ownsUpgrade
					? Color3.fromRGB(13, 13, 13)
					: Color3.fromRGB(65, 65, 65);
			newUpgrade.Purchase.TextColor3 =
				!ownsUpgrade && balance.balance >= upgrade.component.cost && !ownsUpgrade
					? Color3.fromRGB(255, 255, 255)
					: ownsUpgrade
					? Color3.fromRGB(245, 255, 97)
					: Color3.fromRGB(255, 22, 14);
			newUpgrade.LayoutOrder = index;
			newUpgrade.Parent = upgradeInfo.UpgradeFrame.Upgrades;
			if (!ownsUpgrade)
				newUpgrade.Purchase.MouseButton1Click.Connect(() => {
					if (onUpgradeClicked) onUpgradeClicked(upgrade);
					else saveUpgrade(world, playerId, balance, profile, upgrade);
				});
		});
}

export function handleUpgrade(
	upgrade: Upgrade,
	player: BasePlayer,
	playerId: AnyEntity,
	levelId: AnyEntity,
	world: World,
	state: ServerState,
) {
	const profile = getProfile(state, player);
	const ownsUpgrade = has(profile.Data.purchasedUpgrades, upgrade.identifier);
	const otherUpgrades = getAllUpgradesForPlayer(world, playerId);
	const upgradeId = world.spawn(upgrade.patch({ purchased: ownsUpgrade }), BelongsTo({ playerId, levelId }));
	const sortedUpgrades = [...otherUpgrades, { componentId: upgradeId, component: upgrade }].sort(
		(a, b) => a.component.cost <= b.component.cost,
	);
	const balance = getOrError(world, playerId, Balance);
	const upgradeInfo = player
		.FindFirstChildOfClass("PlayerGui")!
		.FindFirstChild("UpgradeInfo")! as UpgradeInfoInstance;
	function onUpgradeClicked(upgrade: ComponentInfo<typeof Upgrade>) {
		if (balance.balance >= upgrade.component.cost) {
			world.insert(playerId, balance.patch({ balance: balance.balance - upgrade.component.cost }));
			world.insert(upgrade.componentId, upgrade.component.patch({ purchased: true }));
			if (!profile.Data.purchasedUpgrades.has(upgrade.component.identifier)) {
				profile.Data.purchasedUpgrades.add(upgrade.component.identifier);
			}
		}
	}
	updateUpgrades({
		upgrades: sortedUpgrades,
		world,
		playerId,
		profile,
		upgradeInfo,
		onUpgradeClicked,
	});
}
