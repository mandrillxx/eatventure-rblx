import { createContext } from "@rbxts/roact";

export type Modal =
	| "settings"
	| "gamepasses"
	| "devproducts"
	| "codes"
	| "upgrades"
	| "renovate"
	| "rewards"
	| "shop"
	| undefined;

export const ModalContext = createContext<Modal>(undefined);
