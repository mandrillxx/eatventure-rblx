import { Balance, BelongsTo, Level, Upgrade, Utility } from "shared/components";
import { ComponentInfo, getOrError } from "shared/util";
import { AnyEntity, World } from "@rbxts/matter";
import { FormatCompact } from "@rbxts/format-number";
import { ServerState } from "server/index.server";
import { IProfile } from "server/data/PurchaseHandler";
import { Profile } from "@rbxts/profileservice/globals";
import Log from "@rbxts/log";

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

function runUpgrade(world: World, upgradeId: AnyEntity, playerId: AnyEntity) {
	const upgrade = getOrError(world, upgradeId, Upgrade);
	const belongsTo = getOrError(world, upgradeId, BelongsTo);
	const levelId = belongsTo.levelId;
	const level = getOrError(world, levelId, Level);

	switch (upgrade.type) {
		case "EmployeePace":
			world.insert(levelId, level.patch({ employeePace: level.employeePace * upgrade.document.amount! }));
			break;
		case "NewCustomer":
			world.insert(levelId, level.patch({ maxCustomers: level.maxCustomers + upgrade.document.amount! }));
			break;
		case "NewEmployee":
			world.insert(levelId, level.patch({ maxEmployees: level.maxEmployees + upgrade.document.amount! }));
			break;
		case "UpdateWorkRate":
			world.insert(levelId, level.patch({ workRate: level.workRate * upgrade.document.amount! }));
			break;
		case "UpdateProfit":
			for (const [id, utility, belongsTo] of world.query(Utility, BelongsTo)) {
				if (belongsTo.playerId !== playerId || utility.type !== upgrade.document.machine) continue;
				world.insert(id, utility.patch({ reward: utility.reward * upgrade.document.amount! }));
				return;
			}
			break;
	}
}

export function saveUpgrade(
	firstRun: boolean,
	world: World,
	playerId: AnyEntity,
	balance: Balance,
	profile: Profile<IProfile, unknown>,
	upgrade: ComponentInfo<typeof Upgrade>,
) {
	const newestUpgrade = getOrError(world, upgrade.componentId, Upgrade);
	if (newestUpgrade.ran) return;
	const hasUpgrade = firstRun
		? profile.Data.purchasedUpgrades.has(newestUpgrade.identifier)
		: newestUpgrade.purchased;

	const handleUpgrade = () => {
		world.insert(upgrade.componentId, newestUpgrade.patch({ purchased: true, ran: true }));
		task.delay(1, () => runUpgrade(world, upgrade.componentId, playerId));
	};

	if (!newestUpgrade.ran && firstRun && hasUpgrade) {
		handleUpgrade();
		return;
	}

	if (!firstRun && balance.balance <= newestUpgrade.cost) {
		Log.Warn("Player does not have enough money to purchase upgrade");
		return;
	}

	if (!firstRun) {
		world.insert(playerId, balance.patch({ balance: balance.balance - upgrade.component.cost }));
		profile.Data.purchasedUpgrades.add(upgrade.component.identifier);
		handleUpgrade();
		return;
	}

	if (hasUpgrade) handleUpgrade();
}

export function updateUpgrades({
	firstRun,
	upgrades,
	world,
	playerId,
	profile,
	upgradeInfo,
}: {
	firstRun: boolean;
	upgrades?: ComponentInfo<typeof Upgrade>[];
	world: World;
	playerId: AnyEntity;
	profile: Profile<IProfile, unknown>;
	upgradeInfo: UpgradeInfoInstance;
}) {
	const _upgrades = upgrades ?? getAllUpgradesForPlayer(world, playerId);
	const baseUpgrade = upgradeInfo.UpgradeFrame.Upgrades.BaseUpgrade;
	const balance = getOrError(world, playerId, Balance);
	for (const child of upgradeInfo.UpgradeFrame.Upgrades.GetChildren()) {
		if (child.IsA("Frame") && child.Name !== "BaseUpgrade") {
			child.Destroy();
		}
	}
	_upgrades.forEach((upgrade) => {
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
		newUpgrade.LayoutOrder = upgrade.componentId;
		newUpgrade.Parent = upgradeInfo.UpgradeFrame.Upgrades;
		const save = (firstRun: boolean) => saveUpgrade(firstRun, world, playerId, balance, profile, upgrade);
		if (firstRun) {
			save(true);
		}
		if (!ownsUpgrade)
			newUpgrade.Purchase.MouseButton1Click.Connect(() => {
				save(false);
			});
	});
}

export function handleUpgrade(
	firstRun: boolean,
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
	const upgradeInfo = player
		.FindFirstChildOfClass("PlayerGui")!
		.FindFirstChild("UpgradeInfo")! as UpgradeInfoInstance;
	updateUpgrades({
		firstRun,
		upgrades: sortedUpgrades,
		world,
		playerId,
		profile,
		upgradeInfo,
	});
}
