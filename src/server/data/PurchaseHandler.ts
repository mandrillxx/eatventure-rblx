import { MarketplaceService, Players } from "@rbxts/services";
import { AnyEntity, World } from "@rbxts/matter";
import { ServerState } from "server/index.server";
import { getOrError } from "shared/util";
import { Balance } from "shared/components";
import { Profile } from "@rbxts/profileservice/globals";
import Log from "@rbxts/log";

export interface IProfile {
	level: number;
	levelName: string;
	money: number;
	gems: number;
	logInTimes: number;
	codesRedeemed: Set<string>;
	purchasedUpgrades: Set<number>;
	purchasedUtilities: Set<string>;
	utilityLevels: Map<string, number>;
}

interface Settings {
	Products: {
		[productId: string]: (playerId: AnyEntity, balance: Balance) => void;
	};
	PurchaseIdLog: number;
}

export function setupPurchases(state: ServerState, world: World) {
	const SETTINGS: Settings = {
		Products: {
			"1622826603": (playerId, balance) => {
				addBalance(playerId, balance, 100_000);
			},
			"1622826775": (playerId, balance) => {
				addBalance(playerId, balance, 500_000);
			},
			"1622827106": (playerId, balance) => {
				addBalance(playerId, balance, 10_000_000);
			},
			"1622827784": (playerId, balance) => {
				addBalance(playerId, balance, 500_000_000);
			},
			"1622828375": (playerId, balance) => {
				addBalance(playerId, balance, 100_000_000_000);
			},
			"1622828653": (playerId, balance) => {
				addBalance(playerId, balance, 500_000_000_000);
			},
			"1622829199": (playerId, balance) => {
				addBalance(playerId, balance, 1_000_000_000_000);
			},
		},
		PurchaseIdLog: 50,
	};

	function addBalance(playerId: AnyEntity, balance: Balance, amount: number) {
		world.insert(playerId, balance.patch({ balance: balance.balance + amount }));
	}

	function GetPlayerProfileAsync(player: Player) {
		let profile = state.profiles.get(player);
		while (!profile && player.IsDescendantOf(Players)) {
			task.wait();
			profile = state.profiles.get(player);
		}
		return profile;
	}

	function PurchaseIdCheckAsync(
		profile: Profile<IProfile, unknown>,
		purchaseId: number,
		grantProductFallback: Callback,
	) {
		if (!profile.IsActive()) {
			if (state.verbose) Log.Info("Player profile is not active");
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}
		const metadata = profile.MetaData;
		let localPurchaseIds = metadata.MetaTags.get("ProfilePurchaseIds") as number[];
		if (!localPurchaseIds) {
			if (state.debug) Log.Info("No purchase ids found, creating new array");
			localPurchaseIds = [];
			metadata.MetaTags.set("ProfilePurchaseIds", localPurchaseIds);
		}

		if (!localPurchaseIds.includes(purchaseId)) {
			while (localPurchaseIds.size() >= SETTINGS.PurchaseIdLog) {
				localPurchaseIds.shift();
			}
			localPurchaseIds.push(purchaseId);
			Log.Warn("Running grant product fallback");
			task.spawn(grantProductFallback);
		}

		let result: Enum.ProductPurchaseDecision | undefined = undefined;
		const checkLatestMetaTags = () => {
			const savedPurchaseIds = metadata.MetaTagsLatest.get("ProfilePurchaseIds") as number[] | undefined;
			if (savedPurchaseIds && savedPurchaseIds.includes(purchaseId)) {
				if (state.debug) Log.Info("Purchase id {@PurchaseId} has been processed", purchaseId);
				result = Enum.ProductPurchaseDecision.PurchaseGranted;
			}
		};

		checkLatestMetaTags();

		const metaTagsConnection = profile.MetaTagsUpdated.Connect(() => {
			checkLatestMetaTags();
			if (!profile.IsActive() && !result) {
				result = Enum.ProductPurchaseDecision.NotProcessedYet;
			}
		});

		while (!result) {
			task.wait();
		}

		metaTagsConnection.Disconnect();

		if (result === Enum.ProductPurchaseDecision.PurchaseGranted) {
			if (state.debug) Log.Warn("Running grant product fallback because result was granted");
			task.spawn(grantProductFallback);
		}
		Log.Info("Purchase id {@PurchaseId} has been processed with result {@Result}", purchaseId, result);
		return result;
	}

	function GrantProduct(player: Player, productId: number) {
		const profile = state.profiles.get(player);
		if (!profile) {
			return;
		}
		const productFunction = SETTINGS.Products[tostring(productId)];
		if (productFunction) {
			const playerId = state.clients.get(player.UserId)!;
			const balance = getOrError(world, playerId, Balance);
			productFunction(playerId, balance);
		} else {
			if (state.debug) Log.Warn("ProductId {@ProductId} has not been defined in Products table", productId);
		}
	}

	function ProcessReceipt(receiptInfo: ReceiptInfo) {
		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

		if (!player) {
			if (state.debug) Log.Info("Player {@PlayerId} is not in game", receiptInfo.PlayerId);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const profile = GetPlayerProfileAsync(player);
		if (!profile) {
			if (state.debug) Log.Info("Player {@PlayerId} does not have a profile", receiptInfo.PlayerId);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		if (state.verbose)
			Log.Info("Player {@PlayerId} has purchased {@ProductId}", receiptInfo.PlayerId, receiptInfo.ProductId);
		return PurchaseIdCheckAsync(profile, receiptInfo.ProductId, () => {
			if (state.debug)
				Log.Info("Granting product {@ProductId} to {@PlayerId}", receiptInfo.ProductId, receiptInfo.PlayerId);
			GrantProduct(player, receiptInfo.ProductId);
		});
	}

	MarketplaceService.ProcessReceipt = ProcessReceipt;
}
