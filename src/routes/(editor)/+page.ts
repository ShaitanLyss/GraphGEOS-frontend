import NodeBrowser from '$lib/editor/node-browser/NodeBrowser.svelte';

export function load() {
	return { sidebarLeft: NodeBrowser };
}
