<script lang="ts">
	import { on } from 'events';
	import {
		moonMenuPositionStore,
		moonMenuVisibleStore,
		moonMenuHideDelayStore,
		moonMenuDropConnectionStore,
		moonMenuConnDropEvent,
		moonMenuItemsStore,
		MoonMenuItem
	} from './moonContextMenu';

	import intersection from 'lodash.intersection';
	import { translateNodeFromGlobal } from '$utils/html';
	import { XmlNode } from '$rete/node/XML/XmlNode';
	import { GetNameNode } from '$rete/node/XML/GetNameNode';

	// setup width and height
	let width = 0;
	let height = 0;
	$: {
		if (moonMenuElement) {
			const rect = moonMenuElement.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
		}
	}

	const menuSpawnPaddingY = 5;
	const menuSpawnPaddingX = 5;

	$: flipMenuH = false && $moonMenuConnDropEvent?.socketData.side === 'input';
	$: flipMenuV =
		$moonMenuConnDropEvent && $moonMenuConnDropEvent.pos.y + height > window.innerHeight;
	$: console.log(flipMenuH, flipMenuV);
	$: x = $moonMenuPositionStore.x + (flipMenuH ? menuSpawnPaddingX : -menuSpawnPaddingX);
	$: y = $moonMenuPositionStore.y + (flipMenuV ? menuSpawnPaddingY + 5 : -menuSpawnPaddingY);

	let moonMenuElement: HTMLDivElement | undefined;

	// $moonMenuHideDelayStore = 10000;

	function hideMenu() {
		$moonMenuVisibleStore = false;
		$moonMenuDropConnectionStore();
	}

	// Setup autohide
	let isMouseOver = false;
	let hideTimeout: NodeJS.Timeout | undefined;
	$: {
		if (!isMouseOver) {
			hideTimeout = setTimeout(() => {
				hideMenu();
			}, $moonMenuHideDelayStore);
		} else {
			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		}
	}

	// Spawn node on item click
	async function onItemClick(item: MoonMenuItem) {
		if (!$moonMenuConnDropEvent) throw new Error('No connection drop event found');
		const socketData = $moonMenuConnDropEvent.socketData;
		const factory = $moonMenuConnDropEvent?.factory;
		if (!factory) throw new Error('No factory found');
		const area = factory.getArea();
		if (!area) throw new Error('No area found');
		const node = item.action(factory);
		await factory.getEditor().addNode(node);
		if ($moonMenuConnDropEvent)
			translateNodeFromGlobal({ globalPos: $moonMenuConnDropEvent.pos, factory, node });

		if (!(node instanceof XmlNode) && !(node instanceof GetNameNode)) {
			console.log(`Autoconnection non supporté vers ${node.label}`);
			hideMenu();
			return;
		}
		const editor = factory.getEditor();

		if (socketData.side === 'output') {
			const sourceNode = editor.getNode(socketData.nodeId);
			await editor.addNewConnection(
				sourceNode,
				socketData.key,
				node,
				node instanceof GetNameNode ? 'xml' : 'children'
			);
		} else {
			const targetNode = editor.getNode(socketData.nodeId);
			await editor.addNewConnection(node, 'value', targetNode, socketData.key);
		}

		// nodeView.translate()
		// area.translate
		hideMenu();
	}

	let filteredItems: MoonMenuItem[] = [];

	$: if ($moonMenuConnDropEvent) {
		const socketData = $moonMenuConnDropEvent.socketData;
		const socket = $moonMenuConnDropEvent.socketData.payload;

		const types = socket.type.split(':')[1]?.split('|');
		if (!types) {
			hideMenu();
		} else {
			filteredItems = $moonMenuItemsStore.filter((item) => {
				if (item.label === 'GetName') {
					console.log(item.inChildrenTypes, types);
				}
				const res = intersection(
					socketData.side === 'output' ? item.inChildrenTypes : [item.outType],
					types
				);
				// console.log(item.inChildrenTypes, types)

				// console.log("intersection", res)
				return res.length > 0;
			});

			if (filteredItems.length === 0) {
				hideMenu();
			}
		}
	}
</script>

{#if $moonMenuVisibleStore}
	<div
		bind:this={moonMenuElement}
		role="menu"
		tabindex="0"
		class="absolute variant-soft-secondary z-10 max-h-1-3"
		style="position: absolute; left: {x}px; top: {y}px; transform: translate({flipMenuH
			? -width
			: 0}px, {flipMenuV ? -height : 0}px);"
		on:mouseenter={() => (isMouseOver = true)}
		on:mouseleave={() => (isMouseOver = false)}
	>
		<div class="searchbar" />
		<div class="max-h-1-3 overflow-x-auto">
			<div class="list">
				{#each filteredItems as item (item.label)}
					<div
						role="menuitem"
						tabindex="0"
						class="px-4 py-2 cursor-pointer hover:bg-soft-primary"
						on:click={() => onItemClick(item)}
					>
						{item.label}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
