<script lang="ts">
	import Menu from '../Menu.svelte';
	import { createActionMenuItem, createNodeMenuItem, type IMenuItem } from '../types';

	const menuItems: IMenuItem[] = [
		createNodeMenuItem({
			label: 'Test node',
			description: 'Test node description',
			menuPath: ['menu', 'path'],
			inTypes: ['cat']
		}),
		createActionMenuItem({
			label: 'Test action',
			description: 'Test action description',
			menuPath: ['menu', 'path'],
			executeAction: () => undefined
		})
	];
</script>

<Menu {menuItems} />
