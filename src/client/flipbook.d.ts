import Roact from "@rbxts/roact";

type IRoact = typeof Roact;

interface IStoryProps<T extends object> {
	controls: T;
}

export interface IStorybook {
	name?: string;
	roact?: IRoact;
	storyRoots: Array<Instance>;
}

export interface IRoactStory {
	name?: string;
	roact: IRoact;
	story: Roact.Element;
	summary?: string;
}

export interface IRoactStoryWithControls<T extends object> {
	controls: T;
	name?: string;
	roact: IRoact;
	story: Roact.Element | ((props: IStoryProps<T>) => Roact.Element);
	summary?: string;
	reactRoblox: typeof import("@rbxts/react-roblox");
}

export interface IFunctionalStory {
	name?: string;
	story: (target: GuiObject) => () => void;
	summary?: string;
}

export interface IFunctionalStoryWithControls<T extends object> {
	controls: T;
	name?: string;
	story: (target: GuiObject, props: IStoryProps<T>) => () => void;
	summary?: string;
}

export type HoarcekatStory = (target: GuiObject) => () => void;
