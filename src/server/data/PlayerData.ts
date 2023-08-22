import Persist from "@rbxts/persist";

export const store = new Persist.Store("PlayerData", {
	key: (player: BasePlayer) => {
		return `Player_${player.UserId}`;
	},

	data: (player: BasePlayer) => {
		const money = player.leaderstats.Money.Value;
		return {
			money,
		};
	},

	default: () => {
		return {
			money: 0,
		};
	},

	userIds: (player: BasePlayer) => {
		return [player.UserId];
	},
});
