import { redirect, type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { sequence } from '@sveltejs/kit/hooks';
// import { SessionAndUser} from '$houdini'
import {
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_SECRET
} from '$env/static/private';

import { GraphQlAdapter } from './backend-interaction/graphql-adapter';
import type { AuthConfig } from '@auth/core';

import { setSession } from '$houdini'

export const houdiniAuth: Handle = async ({ event, resolve }) => {
	// get the user information however you want
	// const user = 
	let sessionToken = event.cookies.get('sessionToken');
	sessionToken = sessionToken ? sessionToken : event.cookies.get('next-auth.session-token');
	console.log("houdiniAuth : sessionToken", sessionToken);
	setSession(event, { token: event.cookies.get('sessionToken') })

	// pass the event onto the default handle
	return await resolve(event)
}
// const svelteKitAuth: Handle = SvelteKitAuth(async (event) => {
// 	const authOptions: AuthConfig = {
// 		trustHost: true,
// 		secret: AUTH_SECRET,
// 		adapter: GraphQlAdapter(event),



// 		callbacks: {
// 			session: async ({ session, user }) => {
// 				session.user.id = user.id;

// 				return session;
// 			}
// 		},

// 		providers: [
// 			Google({
// 				clientId: GOOGLE_CLIENT_ID,
// 				clientSecret: GOOGLE_CLIENT_SECRET
// 			}),
// 			GitHub({
// 				clientId: GITHUB_ID,
// 				clientSecret: GITHUB_SECRET
// 			})
// 		]
// 	};
// 	return authOptions;
// }) satisfies Handle;

const public_routes = [
	// '/auth/**',
	'/tauri-auth/**'
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
	// console.log(import.meta.env.MODE)
	// If the requested URL is not a public route
	// return resolve(event);
	// TODO : handle static site generation
	// console.log("soup", event);
	// return resolve(event);
	if (!isPublicRoute && event.url.host !== 'sveltekit-prerender') {
		const session = await event.locals.getSession();
		if (!session) {
			try {
				const response = await fetch("localhost:8000/health");
				if (response.ok)
					throw redirect(303, '/tauri-auth?redirect=' + event.url.pathname);
				else {
					const body = await response.json();
					console.log("MoonAuth : getSession : Backend is dead", body);
				}
			}
			catch (error) {
				console.log("MoonAuth : Backend is dead");
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

	event.locals.getSession = async () => {
		if (!sessionToken) {
			return null;
		}
		if (event.locals.session) {
			return event.locals.session;
		}

		const { SessionAndUserStore } = await import("$houdini");
		const sessionAndUser = new SessionAndUserStore();
		let data;
		try {
			data = (
				await sessionAndUser.fetch({ event, variables: { sessionToken: sessionToken } })
			).data;
		} catch (error) {
			console.log("MoonAuth : getSession : error : ", error.message);
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
}


export const handle: Handle = sequence(localization, houdiniAuth, moonAuth, authorization);
