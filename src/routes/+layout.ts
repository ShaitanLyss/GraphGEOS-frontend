import type { LayoutLoad } from './$types';
import { loadLocale } from '$lib/global/localization';
import { load_GraphEditorData, type SessionAndUser$result, type UserAuthInfo } from '$houdini';

export const ssr = true;

export const load: LayoutLoad = async (event) => {
	await loadLocale();
	return {
		publicConfig: event.data.publicConfig,
		...(await load_GraphEditorData({ event }))
	};

	// const sessionToken = localStorage.getItem('sessionToken')?.replaceAll('"', '');
	// // console.log(window.location)
	// // if (typeof sessionToken !== 'string' && window.location.pathname !== '/auth') {
	// // 	throw redirect(307, '/auth');
	// // }
	// console.log('load session token', sessionToken);
	// const { SessionAndUserStore } = await import('$houdini');
	// const sessionAndUser = new SessionAndUserStore();
	// let data;
	// try {
	// 	data = (await sessionAndUser.fetch({ event, variables: { sessionToken: sessionToken } })).data;
	// } catch (error) {
	// 	console.log('MoonAuth : getSession : error : ', error.message);
	// 	return null;
	// }
	// const session = data?.session;
	// const user = data?.session?.user;
	// if (session == null || user == null) {
	// 	return null;
	// }
	// // event.locals.session = { session: session, user: user };
	// console.log('LayoutLoad : getSessionAndUser : session : ', session);
	// return { session: session, user: user };
};
