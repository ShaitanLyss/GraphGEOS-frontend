<script lang="ts">
	import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
	import { filterMenuItems, type IHierachicalMenu, collectMenuView } from './utils';
	import MenuItem from './MenuItems.svelte';
	import { onMount } from 'svelte';
	import type { IMenuItem } from './types';

	export let searchBar = true;
	export let menuItems: IMenuItem[];

	let treeView: TreeView;
	let query = '';
	let menu: IHierachicalMenu;

	onMount(() => {
		treeView.expandAll();
	});

	$: filteredMenuItems = filterMenuItems({
		menuItems,
		filter: { label: query, description: query, menuPath: [query], tags: [query] },
		verifyAll: false
	});
	$: {
		menu = collectMenuView(filteredMenuItems);
		console.log('Menu', menu);
		if (treeView) treeView.expandAll();
	}
</script>

<div class="flex flex-col">
	{#if searchBar}
		<div class="flex justify-center items-center">
			<input
				type="text"
				class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				placeholder="Search..."
				bind:value={query}
			/>
		</div>
	{/if}
	<TreeView bind:this={treeView} width="">
		<MenuItem {menu} />
	</TreeView>
</div>
