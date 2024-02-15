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
import type { Action } from 'svelte/action';
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

export const keyboardShortcut: Action<
	HTMLElement,
	{
		key: string;
		ctrl?: boolean;
		alt?: boolean;
		shift?: boolean;
		targetDocument?: boolean;
		action: () => unknown;
	}
> = (node, { key, ctrl = false, alt = false, shift = false, targetDocument = true, action }) => {
	const target = targetDocument ? document : node;
	const shortcut_pieces: string[] = [];
	if (ctrl) shortcut_pieces.push('ctrl');
	if (alt) shortcut_pieces.push('alt');
	if (shift) shortcut_pieces.push('shift');
	shortcut_pieces.push(key);
	console.log('Adding keyboard shortcut ', shortcut_pieces.join('+'));
	const listener = (e: KeyboardEvent) => {
		const ignoreElements = ['INPUT', 'TEXTAREA'];
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (
			(targetDocument && ignoreElements.includes(target?.tagName)) ||
			target.contentEditable === 'true'
		) {
			return;
		}
		if (
			e.key.toLowerCase() !== key.toLowerCase() ||
			e.ctrlKey !== ctrl ||
			e.altKey !== alt ||
			e.shiftKey !== shift
		)
			return;
		e.preventDefault();

		console.log(`shortcut: ${shortcut_pieces.join('+')}`);
		action();
	};
	target.addEventListener('keydown', listener);
	return {
		destroy: () => {
			console.log('Removing keyboard shortcut', key, ctrl, alt, shift);
			target.removeEventListener('keydown', listener);
		}
	};
};
