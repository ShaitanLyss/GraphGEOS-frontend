import type { Writable } from 'svelte/store';

export type TabProps = {
	id: string;
	name: string;
};

export type TabContext = {
	tabs: Writable<TabProps[]>;
	tabSet: Writable<string | undefined>;
	clearTabs: Writable<() => void>;
};
