import { load_GraphEditorData } from '$houdini';
import NodeBrowser from '$lib/editor/node-browser/NodeBrowser.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	return {
		sidebarLeft: NodeBrowser
	};
};
