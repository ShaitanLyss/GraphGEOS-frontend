<script lang="ts">
	import { TreeViewItem } from '@skeletonlabs/skeleton';
	import type { IHierachicalMenu } from './utils';
	import { isNodeMenuItem, type INodeMenuItem, type IBaseMenuItem } from '$lib/menu';
	import { moonMenuFactoryStore } from '$lib/menu/context-menu/moonContextMenu';
	import { ErrorWNotif, getContext } from '$lib/global';
	export let menu: IHierachicalMenu;

	$: submenus = menu.getSubmenus();
	$: menuItems = menu.getMenuItems();
	const onItemClick = getContext('moonMenuOnItemClick');

	async function handleItem(item: IBaseMenuItem) {
		if (isNodeMenuItem(item)) {
			console.log(item);
			const factory = $moonMenuFactoryStore;
			if (!factory) throw new ErrorWNotif('No factory found');
			// item.getAddNode()({factory});
			await onItemClick({ action: item.getAddNode() });
		}
	}
</script>

{#each submenus as submenu, index (index)}
	<TreeViewItem>
		{submenu.getLabel()}
		<svelte:fragment slot="children">
			<svelte:self menu={submenu} />
		</svelte:fragment>
	</TreeViewItem>
{/each}
{#each menuItems as item, index (index)}
	<TreeViewItem>
		<button type="button" on:click={() => handleItem(item)}>{item.getLabel()}</button>
	</TreeViewItem>
{/each}
