import type { publicConfig } from '$lib/config';
import type { EditorContext } from '$lib/editor';
import type { GeosDataContext, GeosSchema } from '$lib/geos';
import type { TabContext } from '$lib/layout';
import {
	type ComponentProps,
	type ComponentType,
	type SvelteComponent,
	type SvelteComponent_1,
	hasContext,
	getContext as svelteGetContext,
	setContext as svelteSetContext
} from 'svelte';
import { ErrorWNotif } from './error';
import type { Writable } from 'svelte/store';
import type { GlobalPopupsContext } from './popup';
import type { MoonMenuItem } from '$lib/menu/context-menu/moonContextMenu';
import type { GeosTypesTree, Session } from '$lib/backend-interaction';

enum Context {
	'editor' = 'Editor Context',
	'session' = 'Session',
	'onSave' = 'What to do when saving (depreciated)',
	'save' = 'What do when saving',
	'tabs' = 'Tabs Context',
	'geos' = 'Geos Data',
	'geos_v2' = 'Geos Data new context',
	'publicConfig' = 'Public Configuration',
	'toggleCodeEditor' = 'Toggle Code Editor',
	'mainRightSideBar' = 'Main Right Side Bar',
	'globalPopups' = 'Global Popups Context',
	'moonMenuOnItemClick' = 'Moon Menu On Item Click'
}

export type RightSidebar<T extends SvelteComponent> = {
	component?: ComponentType<T>;
	props?: ComponentProps<T>;
};

export type SaveHandler = {
	save: () => void;
};

export type NewGeosContext = {
	typesTree: Writable<GeosTypesTree>;
	typesPaths: Writable<Record<string, string[]> | undefined>;
	geosSchema: GeosSchema;
};

export type resolveContext<
	K = keyof typeof Context,
	Component extends SvelteComponent = SvelteComponent
> = K extends 'editor'
	? EditorContext
	: K extends 'onSave'
		? (params?: { displaySuccess?: boolean }) => void
		: K extends 'save'
			? Writable<Map<string, SaveHandler>>
			: K extends 'tabs'
				? Writable<TabContext | undefined>
				: K extends 'geos'
					? GeosDataContext
					: K extends 'geos_v2'
						? NewGeosContext
						: K extends 'publicConfig'
							? typeof publicConfig
							: K extends 'toggleCodeEditor'
								? () => void
								: K extends 'mainRightSideBar'
									? Writable<RightSidebar<Component>>
									: K extends 'globalPopups'
										? GlobalPopupsContext
										: K extends 'moonMenuOnItemClick'
											? (item: MoonMenuItem) => Promise<void>
											: K extends 'session'
												? Session | null
												: never;

export function getContext<
	K extends keyof typeof Context,
	Component extends SvelteComponent = SvelteComponent
>(key: K): resolveContext<K, Component> {
	if (!hasContext(key)) {
		throw new ErrorWNotif({ emessage: `Context ${key} not found` });
	}
	return svelteGetContext<resolveContext<K, Component>>(key);
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
