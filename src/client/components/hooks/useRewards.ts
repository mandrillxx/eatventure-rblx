import { Network } from "shared/network";

export function useRewards() {
	const canOpen = true;

	const claimReward = () => {
		print("Claimed reward");
	};

	return {
		canOpen,
		claimReward,
	};
}
