<script lang="ts">
	import { ErrorWNotif, _ } from '$lib/global';
	import { createActionMenuItem } from '$lib/menu';
	import { spawnMoonMenu } from '$lib/menu/context-menu/moonContextMenu';
	import type { NodeFactory } from '$rete';
	import type { Schemes } from '$rete/node/Schemes';
	import type { Position } from 'rete-render-utils/_types/types';

	// svelte-ignore unused-export-let
	export let data: Schemes['Connection'] & { isLoop?: boolean };

	// svelte-ignore unused-export-let
	export let start: Position;
	// svelte-ignore unused-export-let
	export let end: Position;
	// svelte-ignore unused-export-let
	export let targetInput: string;
	// svelte-ignore unused-export-let
	export let target: string;
	// svelte-ignore unused-export-let
	export let source: string;
	// svelte-ignore unused-export-let
	export let sourceOutput: string;
	// svelte-ignore unused-export-let
	export let isPseudo = undefined;
	// svelte-ignore unused-export-let
	export let id: string;
	// svelte-ignore unused-export-let
	export let path: string;

	export let selected: boolean | undefined;

	export let factory: NodeFactory | undefined;

	function onClick() {
		if (!factory) throw new ErrorWNotif('No factory');
		factory.selectConnection(id);
	}

	function openContextMenu(event: MouseEvent) {
		spawnMoonMenu({
			pos: { x: event.clientX, y: event.clientY },
			items: [
				createActionMenuItem({
					label: $_('button.delete'),
					description: $_('menu.delete-selected.descr'),
					executeAction: () => {
						if (!factory) throw new ErrorWNotif('No factory');
						factory.deleteSelectedElements();
					}
				})
			]
		});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	data-testid="connection"
	class="group hover:cursor-pointer"
	on:pointerdown|stopPropagation
	on:click|stopPropagation={() => onClick()}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			e.stopPropagation();
			onClick();
		}
	}}
	on:contextmenu|preventDefault|stopPropagation={openContextMenu}
>
	<path class="stroke-transparent pointer-events-auto" d={path} fill="none" stroke-width={'20px'} />
	<path
		class="visible-path pointers-events-none"
		class:group-hover:brightness-150={!selected}
		d={path}
		class:!stroke-primary-400={selected}
	/>
</svg>

<style>
	/*! https://github.com/retejs/connection-plugin/commit/206ca0fd7fb82801ac45a0f7180ae05dff9ed901 */
	svg {
		overflow: visible !important;
		position: absolute;
		pointer-events: none;
		width: 9999px;
		height: 9999px;
	}

	svg path.visible-path {
		fill: none;
		stroke-width: 5px;
		stroke: steelblue;
		pointer-events: none;
	}
</style>
