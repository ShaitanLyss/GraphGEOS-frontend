import type { RequestEvent } from '@sveltejs/kit';
import * as ts_cookies from 'typescript-cookie';
import type { CookieAttributes as CookieAttributes_ } from 'typescript-cookie/dist/types';
import { browser } from '$app/environment';

enum CookieNames {
	locale = 'geos_graph_locale',
	current = 'geos_graph_lightmode',
	theme = 'geos_graph_theme'
}

type CookieAttributes = {
	forever?: boolean;
	global?: boolean;
};

// Define the options for the setCookieType
export type setCookieType = (
	name: keyof typeof CookieNames,
	value: string | undefined,
	options?: CookieAttributes
) => void;

export const setCookie: setCookieType = (name, value, options = {}) => {
	const { forever = false, global = true } = options;
	const attributes: CookieAttributes_ = {};
	if (forever) {
		attributes.expires = new Date(253402300000000);
	}
	if (global) {
		attributes.path = '/';
	}
	attributes.sameSite = 'lax';
	ts_cookies.setCookie(CookieNames[name], value, attributes);
};

export function getCookie(name: keyof typeof CookieNames, default_?: string): string | undefined {
	console.log('getting cookie', name);
	console.log('cookie value', ts_cookies.getCookie(CookieNames[name]));
	return ts_cookies.getCookie(CookieNames[name]) ?? default_;
}

export function getCookieServer(
	name: keyof typeof CookieNames,
	event: RequestEvent
): string | undefined {
	return event.cookies.get(CookieNames[name]);
}
