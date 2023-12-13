// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { publicConfig } from '$lib/config';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: getSession;
			session: unknown;
			publicConfig: typeof publicConfig;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
