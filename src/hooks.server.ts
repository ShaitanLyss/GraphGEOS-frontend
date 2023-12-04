import { redirect, type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { sequence } from '@sveltejs/kit/hooks';
import { setSession } from '$houdini';
import { getBackendAddress, isAuthEnabled } from '$utils/config';
// import { SessionAndUser} from '$houdini'

const public_routes = [
	// '/auth/**',
	'/auth/**'
	// "/"
];

async function authorization({ event, resolve }) {
	// Check if the requested URL matches any public routes
	const isPublicRoute = public_routes.some((pattern) => {
		const regexPattern = new RegExp(
			`^${pattern.replace(/\/\*\*/g, '.*').replace(/\/\*/g, '[^/]*')}$`
		);
		return regexPattern.test(event.url.pathname);
	});
	if (!isAuthEnabled()) {
		return resolve(event);
	}
	// If the requested URL is not a public route
	// return resolve(event);
	// TODO : handle static site generation
	// console.log("soup", event);
	// return resolve(event);
	if (!isPublicRoute && event.url.host !== 'sveltekit-prerender') {
		const session = await event.locals.getSession();
		if (!session) {
			let shouldRedirect = false;
			try {
				const response = await fetch(getBackendAddress(`/health`));
				if (response.ok) shouldRedirect = true;
				else {
					const body = await response.json();
					console.log('MoonAuth : getSession : Backend is dead', body);
				}
			} catch (error) {
				console.log('MoonAuth : Backend is dead', error);
			}
			if (shouldRedirect) {
				throw redirect(303, '/auth?redirect=' + event.url.pathname);
			}
		}
	}
	// If the request is still here, just proceed as normal
	return resolve(event);
}

const localization: Handle = ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	return resolve(event);
};

const moonAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('sessionToken');
	// console.log("moonAuth", sessionToken)
	setSession(event, { token: sessionToken });
	event.locals.getSession = async () => {
		if (!sessionToken) {
			return null;
		}
		if (event.locals.session) {
			return event.locals.session;
		}

		const { SessionAndUserStore } = await import('$houdini');
		const sessionAndUser = new SessionAndUserStore();
		let data;
		try {
			data = (await sessionAndUser.fetch({ event, variables: { sessionToken: sessionToken } }))
				.data;
		} catch (error) {
			console.log('MoonAuth : getSession : error : ', error.message);
			return null;
		}
		const session = data?.session;
		const user = data?.session?.user;
		if (session == null || user == null) {
			return null;
		}
		event.locals.session = { session: session, user: user };
		console.log('MoonAuth : getSessionAndUser : session : ', session);
		return { session: session, user: user };
	};
	return resolve(event);
};

export const handle: Handle = sequence(
	localization, 
	moonAuth, 
	authorization
	);
