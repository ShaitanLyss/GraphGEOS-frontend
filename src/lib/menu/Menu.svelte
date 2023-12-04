<script lang="ts">
	import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
	import { filterMenuItems, type IHierachicalMenu, collectMenuView } from './utils';
	import TreeViewMenuItems from './TreeViewMenuItems.svelte';
	import { onMount } from 'svelte';
	import type { IMenuItem, MenuType } from './types';
	import throttle from 'lodash.throttle';
	import { Popover } from '@mantine/core';
	import PopoverMenuItems from './PopoverMenuItems.svelte';

	export let searchBar = true;
	export let menuItems: IMenuItem[];
	export let type: MenuType = 'tree';

	let filteredMenuItems = menuItems;
	let treeView: TreeView;
	let query = '';
	let menu: IHierachicalMenu;

	onMount(() => {
		if (type === 'tree') treeView.expandAll();
	});

	function updateFilteredItems() {
		filteredMenuItems =
			query === ''
				? menuItems
				: filterMenuItems({
						menuItems,
						filter: { label: query, description: query, menuPath: [query], tags: [query] },
						verifyAll: false,
						allowMissingKey: false
				  });
	}

	$: {
		menu = collectMenuView(filteredMenuItems);
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
				on:input={throttle(updateFilteredItems, 100)}
			/>
		</div>
	{/if}
	{#if type === 'tree'}
		<TreeView bind:this={treeView} width="">
			<TreeViewMenuItems {menu} />
		</TreeView>
	{:else if type === 'popover'}
		<PopoverMenuItems {menu} width="w-full" />
	{:else}
		Menu type '{type}' not implemented
	{/if}
</div>
