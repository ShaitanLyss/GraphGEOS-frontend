import type { Writable } from 'svelte/store';

export type TabProps = {
	id: string;
	name: string;
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
};
