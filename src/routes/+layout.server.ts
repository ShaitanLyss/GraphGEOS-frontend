import { getLocaleFromNavigator, init } from 'svelte-i18n';

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator()
});

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	return {
		session: await event.locals.getSession(),
	};
};