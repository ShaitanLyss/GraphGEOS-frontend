// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { publicConfig } from '$lib/config';
import type { Session as MySession } from '$lib/backend-interaction';
import type { PageData as RemoteExplorerPageData } from './routes/remote-explorer/[user]/[host]/[...path]/$houdini';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<MySession | null>;
			session: unknown;
			publicConfig: typeof publicConfig;
		}
		interface PageState {
			remoteExplorerIntegration?: {
				data: RemoteExplorerPageData;
				path: string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
