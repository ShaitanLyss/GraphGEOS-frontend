import { browser } from '$app/environment';
import { setSession } from '$houdini';
import { locale, waitLocale } from 'svelte-i18n';
import { sessionTokenStore } from './sessionTokenStore.js';
import { redirect } from '@sveltejs/kit';


// import { getLocaleFromNavigator, init } from 'svelte-i18n';
// init({
// 	fallbackLocale: 'en',
// 	initialLocale: getLocaleFromNavigator()
// });

export const ssr = false;
export const prerender = false;

export const load = async (event) => {
	console.log('load: browser', browser);
	if (!browser) {
		return {};
	}
	
	
	// if (browser) {
	// 	locale.set(window.navigator.language)
	// }
	await waitLocale();
	const sessionToken = localStorage.getItem('sessionToken')?.replaceAll('"', '');
	if (sessionToken == null) {
		throw redirect(307, '/auth');
	}
	console.log('load session token', sessionToken);
	const { SessionAndUserStore } = await import('$houdini');
	const sessionAndUser = new SessionAndUserStore();
	let data;
	try {
		data = (await sessionAndUser.fetch({ event, variables: { sessionToken: sessionToken } })).data;
	} catch (error) {
		console.log('MoonAuth : getSession : error : ', error.message);
		return null;
	}
	const session = data?.session;
	const user = data?.session?.user;
	if (session == null || user == null) {
		return null;
	}
	// event.locals.session = { session: session, user: user };
	console.log('LayoutLoad : getSessionAndUser : session : ', session);
	return { session: session, user: user };
};
