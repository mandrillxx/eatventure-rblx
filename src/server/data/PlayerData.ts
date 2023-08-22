import Persist from "@rbxts/persist";

export const store = new Persist.Store("PlayerData", {
	key: (player: BasePlayer) => {
		return `Player_${player.UserId}`;
	},

	data: (player: BasePlayer) => {
		const money = player.leaderstats.Money.Value;
		const utilityLevels = new Map<string, number>();
		player.Utilities.GetChildren().forEach((utility) => {
			if (!utility.IsA("IntValue")) return;
			utilityLevels.set(utility.Name, utility.Value);
		});
		return {
			money,
			utilityLevels,
		};
	},

	default: () => {
		return {
			money: 0,
			utilityLevels: new Map<string, number>(),
		};
	},

	userIds: (player: BasePlayer) => {
		return [player.UserId];
	},
});
