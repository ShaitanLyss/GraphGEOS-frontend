import type { RequestEvent } from '@sveltejs/kit';
import * as ts_cookies from 'typescript-cookie';
import type { CookieAttributes as CookieAttributes_ } from 'typescript-cookie/dist/types';

enum CookieNames {
	locale = 'geos_graph_locale',
	current = 'geos_graph_lightmode'
}

type CookieAttributes = {
	forever?: boolean;
};

// Define the options for the setCookieType
export type setCookieType = (
	name: keyof typeof CookieNames,
	value: string | undefined,
	options?: CookieAttributes
) => void;

export const setCookie: setCookieType = (name, value, options = {}) => {
	const { forever = false } = options;
	const attributes: CookieAttributes_ = {};
	if (forever) {
		attributes.expires = new Date(253402300000000);
	}
	attributes.sameSite = 'lax';
	ts_cookies.setCookie(CookieNames[name], value, attributes);
};

export function getCookie(name: keyof typeof CookieNames): string | undefined {
	return ts_cookies.getCookie(CookieNames[name]);
}

export function getCookieServer(
	name: keyof typeof CookieNames,
	event: RequestEvent
): string | undefined {
	return event.cookies.get(CookieNames[name]);
}
