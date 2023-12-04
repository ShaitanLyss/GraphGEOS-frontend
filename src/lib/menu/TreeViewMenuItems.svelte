<script lang="ts">
	import { TreeViewItem } from '@skeletonlabs/skeleton';
	import type { IHierachicalMenu } from './utils';

	export let menu: IHierachicalMenu;

	$: submenus = menu.getSubmenus();
	$: menuItems = menu.getMenuItems();
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
		{item.getLabel()}
	</TreeViewItem>
{/each}
