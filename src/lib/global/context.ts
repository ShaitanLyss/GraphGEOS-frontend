import type { publicConfig } from '$lib/config';
import type { EditorContext } from '$lib/editor';
import type { GeosDataContext } from '$lib/geos';
import type { TabContext } from '$lib/layout';
import { getContext as svelteGetContext, setContext as svelteSetContext } from 'svelte';

enum Context {
	'editor' = 'Editor Context',
	'onSave' = 'What to do when saving',
	'tabs' = 'Tabs Context',
	'geos' = 'Geos Data',
	'publicConfig' = 'Public Configuration'
}

type resolveContext<K = keyof typeof Context> = K extends 'editor'
	? EditorContext
	: K extends 'onSave'
	? () => void
	: K extends 'tabs'
	? TabContext
	: K extends 'geos'
	? GeosDataContext
	: K extends 'publicConfig'
	? typeof publicConfig
	: never;

export function getContext<K extends keyof typeof Context>(key: K): resolveContext<K> | undefined {
	return svelteGetContext<resolveContext<K> | undefined>(key);
}

export function setContext<K extends keyof typeof Context>(key: K, value: resolveContext<K>): void {
	svelteSetContext(key, value);
}

/**
 * Returns the public configuration.
 *
 * Warning : this function must be called during
 * component initialization due to the use of context.
 */
export function getPublicConfig(): typeof publicConfig {
	const res = getContext('publicConfig');
	if (!res) throw new Error('publicConfig not found');
	return res;
}
