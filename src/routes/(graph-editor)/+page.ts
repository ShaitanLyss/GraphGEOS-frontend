import NodeBrowser from '$lib/editor/node-browser/NodeBrowser.svelte';
import ContextualHelp from '$lib/help/ContextualHelp.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	return {
		sidebarLeft: NodeBrowser,
		footer: ContextualHelp
	};
};
