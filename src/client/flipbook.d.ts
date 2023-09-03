import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";

type React = typeof Roact;
type ReactRoblox = typeof ReactRoblox;

interface StoryProperties<T extends object> {
	controls: T;
}

/**
 * A storybook interface. Used for telling Flipbook
 * the information about your stories.
 */
export interface Storybook {
	name?: string;
	react: React;
	reactRoblox: ReactRoblox;
	storyRoots: ReadonlyArray<Instance>;
}

interface BaseFunctionStory {
	name?: string;
	summary?: string;
}

interface BaseStory extends BaseFunctionStory {
	react: React;
	reactRoblox: ReactRoblox;
}

export interface ReactStory extends BaseStory {
	story: Roact.Element;
}

export interface ReactStoryWith<T extends object> extends BaseStory {
	controls: T;
	story: Roact.Element | Roact.FunctionComponent<StoryProperties<T>>;
}

export interface FunctionStory extends BaseFunctionStory {
	story: (target: GuiObject) => () => void;
}

export interface FunctionStoryWith<T extends object> extends BaseFunctionStory {
	controls: T;
	story: (target: GuiObject, properties: StoryProperties<T>) => () => void;
}

export type HoarcekatStory = (target: GuiObject) => () => void;
