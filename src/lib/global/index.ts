export * from './context';
export * from './cookies';
export * from './error';
export * from './notification';
export * from './sessionTokenStore';
export * from './popup';

import { browser } from '$app/environment';
import { type Writable, writable, get } from 'svelte/store';
import type { Action } from 'svelte/action';
import LocaleSwitcher__SvelteComponent_ from './LocaleSwitcher.svelte';
import ThemeSwitcher__SvelteComponent_ from './ThemeSwitcher.svelte';
import { getCookie } from './cookies';
import { moonMenuVisibleStore } from '$lib/menu/context-menu/moonContextMenu';
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
		key?: string;
		ctrl?: boolean;
		alt?: boolean;
		shift?: boolean;
		targetDocument?: boolean;
		isMenuShortcut?: boolean;
		preventDefault?: boolean;
		active?: boolean;
		action: (params: { node: HTMLElement; e: KeyboardEvent }) => unknown;
	}
> = (
	node,
	{
		key,
		ctrl = false,
		alt = false,
		shift = false,
		isMenuShortcut = false,
		targetDocument = true,
		preventDefault = true,
		action,
		active = true
	}
) => {
	if (!key) return;
	const target = targetDocument ? document : node;
	const shortcut_pieces: string[] = [];
	if (ctrl) shortcut_pieces.push('ctrl');
	if (alt) shortcut_pieces.push('alt');
	if (shift) shortcut_pieces.push('shift');
	shortcut_pieces.push(key);

	const listener = (e: KeyboardEvent) => {
		if (!isMenuShortcut && get(moonMenuVisibleStore)) return;
		const ignoreElements = ['INPUT', 'TEXTAREA'];
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		const isTabInput = target.parentElement?.parentElement?.classList.contains('tab');
		if (
			(targetDocument && !isTabInput && ignoreElements.includes(target?.tagName)) ||
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
		if (preventDefault) e.preventDefault();

		console.log(`shortcut: ${shortcut_pieces.join('+')}`);
		action({ e, node });
	};
	if (active) {
		console.log('Adding keyboard shortcut ', shortcut_pieces.join('+'));
		target.addEventListener('keydown', listener);
	}
	return {
		destroy: () => {
			if (!key) return;
			if (active) {
				console.log('Removing keyboard shortcut ', shortcut_pieces.join('+'));
				target.removeEventListener('keydown', listener);
			}
		},
		update: (params) => {
			if (params.active === false) {
				console.log('Removing keyboard shortcut', shortcut_pieces.join('+'));
				target.removeEventListener('keydown', listener);
			} else {
				console.log('Adding keyboard shortcut', shortcut_pieces.join('+'));
				target.addEventListener('keydown', listener);
			}
		}
	};
};
