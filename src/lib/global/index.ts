export * from './context';
export * from './cookies';
export * from './error';
export * from './notification';
export * from './sessionTokenStore';
export * from './popup';

import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';
import LocaleSwitcher__SvelteComponent_ from './LocaleSwitcher.svelte';
import ThemeSwitcher__SvelteComponent_ from './ThemeSwitcher.svelte';
import { getCookie } from './cookies';
export { _, isLoading as isLocaleLoading, Localization } from './localization';
export {
	LocaleSwitcher__SvelteComponent_ as LocaleSwitcher,
	ThemeSwitcher__SvelteComponent_ as ThemeSwitcher
};

export const setTheme = (theme: string) => {
	console.log('Setting theme', theme);
	if (browser) document.body.setAttribute('data-theme', theme);
};

export const theme: Writable<string> = writable();
