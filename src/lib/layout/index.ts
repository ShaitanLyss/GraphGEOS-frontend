export * from './tabs';
import Tabs__SvelteComponent_ from './Tabs.svelte';
import MainHeader__SvelteComponent_ from './MainHeader.svelte';
import HeaderButton__SvelteComponent_ from './HeaderButton.svelte';
import GlobalPopup__SvelteComponent_ from '../global/popup/GlobalPopup.svelte';
import Popup__SvelteComponent_ from './Popup.svelte';
import { Writable, writable } from 'svelte/store';
import type { ComponentType } from 'svelte';

export {
	Tabs__SvelteComponent_ as Tabs,
	MainHeader__SvelteComponent_ as MainHeader,
	HeaderButton__SvelteComponent_ as HeaderButton,
	GlobalPopup__SvelteComponent_ as GlobalPopup,
	Popup__SvelteComponent_ as Popup
};
