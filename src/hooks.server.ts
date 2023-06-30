import { redirect, type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/core/providers/github";
import { sequence } from '@sveltejs/kit/hooks';
import { GITHUB_ID, GITHUB_SECRET, DB_PASSWD, APP_ENV } from "$env/static/private";
const { ENV } = import.meta.env;
console.log("feugheiuzghie", ENV);
// import "@auth/mikro-orm-adapter/lib/entities.js"
import { MikroOrmAdapter } from "@auth/mikro-orm-adapter";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { EntityCaseNamingStrategy, MikroORM, MongoNamingStrategy } from '@mikro-orm/core';

const svelteKitAuth: Handle = SvelteKitAuth({
	adapter: MikroOrmAdapter({
		dbName: "makutu-ui-" + APP_ENV,
		driver: PostgreSqlDriver,
		password: DB_PASSWD,
		debug: APP_ENV === "dev",
		namingStrategy: MongoNamingStrategy
		
	}),
	callbacks: {
		
	},

	providers: [
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET,
		}),
		],
});

const public_routes = [
	"/auth/**",
	"/"
];

async function authorization({ event, resolve }) {
	// Check if the requested URL matches any public routes
	const isPublicRoute = public_routes.some((pattern) => {
		const regexPattern = new RegExp(`^${pattern.replace(/\/\*\*/g, '.*').replace(/\/\*/g, '[^/]*')}$`);
		return regexPattern.test(event.url.pathname);
	});

	// If the requested URL is not a public route
	if (!isPublicRoute) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, "/auth?redirect=" + event.url.pathname);
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
}

export const handle: Handle = sequence(localization, svelteKitAuth, authorization);