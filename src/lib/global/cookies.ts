import type { RequestEvent } from '@sveltejs/kit';
import * as ts_cookies from 'typescript-cookie';
import type { setCookie as t_setCookie } from 'typescript-cookie';
import { browser } from '$app/environment';

enum CookieNames {
	locale = 'geos_graph_locale',
	current = 'geos_graph_lightmode',
	theme = 'geos_graph_theme',
	encrypted_linux_password = 'encrypted_linux_password'
}

type CookieAttributes = {
	forever?: boolean;
	global?: boolean;
	secure?: boolean;
};

// Define the options for the setCookieType
export type setCookieType = (
	name: keyof typeof CookieNames,
	value: string | undefined,
	options?: CookieAttributes
) => void;

export const setCookie: setCookieType = (name, value, options = {}) => {
	const { forever = false, global = true, secure = false } = options;
	const attributes: Parameters<typeof t_setCookie>['2'] = {};
	attributes.sameSite = 'Strict';
	if (forever) {
		attributes.expires = new Date(253402300000000);
	}
	if (global) {
		attributes.path = '/';
	}
	if (secure) {
		// ts_cookies.setCookie['']
		attributes.secure = true;
		attributes.sameSite = 'strict';
	}
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
