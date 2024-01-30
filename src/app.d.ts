// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { publicConfig } from '$lib/config';
import type { Session as MySession } from '$lib/backend-interaction';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<MySession | null>;
			session: unknown;
			publicConfig: typeof publicConfig;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
