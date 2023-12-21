import type { Writable } from 'svelte/store';

/**
 * @typedef {Object} TabProps
 * @property {string} id
 * @property {string} name
 * @property {() => void} onClose - callback when the tab is closed
 */
export type TabProps = {
	id: string;
	name: string;
	select?: boolean;
	onClose?: () => void;
	onDblClick?: () => void;
};

export type AddModel = () => void;
export type AddModelProps = {
	addModel: AddModel;
	label: string;
	tooltip: string;
	path?: string;
};
export type AddModelOptions = AddModelProps[];
export type SetMainAddModel = (options: AddModelProps | undefined) => void;

export type TabContext = {
	tabSet: Writable<string | undefined>;
	clearTabs: () => void;
	setMainAddModel: SetMainAddModel;
	addTab: (params: { key: string; props: TabProps }) => void;
	deleteTab: (key: string) => void;
	renameTab: (key: string, name: string) => void;
	getTabKeys: () => string[];
};
