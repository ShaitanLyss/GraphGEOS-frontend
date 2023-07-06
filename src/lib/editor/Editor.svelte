<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { EditorExample } from '../../rete/example/types';
	import { AppShell, ModalSettings, modeCurrent } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faCloud, faCubes, faCubesStacked } from '@fortawesome/free-solid-svg-icons';
	import { modalStore } from '@skeletonlabs/skeleton';
	import DownloadGraphButton from '$lib/editor/DownloadGraphButton.svelte';
	import SaveGraphButton from './SaveGraphButton.svelte';
	import EditorButton from './EditorButton.svelte';
	import LoadGraphFromFileButton from './LoadGraphFromFileButton.svelte';
	import type { NodeFactory } from '$rete/node/NodeFactory';
	import type { NodeEditor } from '$rete/NodeEditor';
	import OpenGraphDrawer from './OpenGraphDrawer.svelte';
	import NodeBrowser from './node-browser/NodeBrowser.svelte';
	import { AreaExtensions } from 'rete-area-plugin';
	import type { Node } from '$rete/node/Node';

	import { notifications } from '@mantine/notifications';
	import { graphql } from '$houdini';

	// import {} from '@fortawesome/free-regular-svg-icons';

	export let loadExample: EditorExample | undefined = undefined;
	export let hidden = false;
	export let name: string;
	export let onNameChange: (name: string) => void = () => {};

	let firstShown = true;

	let container: HTMLDivElement;
	let editor: NodeEditor;
	let factory: NodeFactory;

	let destroyEditor: Function;
	let onFirstShown: Function;

	let debouncedTimer: NodeJS.Timeout | undefined;
	function debouncedHandler(handler: () => void, timeout = 500) {
		if (debouncedTimer) clearTimeout(debouncedTimer);
		debouncedTimer = setTimeout(handler, timeout);
	}




	onMount(async () => {
		// const { createEditor } = await import('./editor');
		// await createEditor(container);
		const { setupEditor } = await import('$rete/editor');
		const tools = await setupEditor(container, loadExample);
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		editor = tools.editor;
		editor.setName(name);
		editor.addOnChangeNameListener(onNameChange);
		factory = tools.factory;
		AreaExtensions.zoomAt(factory.getArea(), factory.getEditor().getNodes());
		const { watchResize } = await import('svelte-watch-resize');
		watchResize(container, () => {
			if (nodesToFocus === undefined) {
				nodesToFocus = getVisibleNodes();
			}
			// debouncedHandler(() => console.log('resize'));
		});
		ready = true;
	});

	onDestroy(() => {
		if (destroyEditor) destroyEditor();
		console.log('destroyed');
	});
	$: if (editor) editor.setName(name, false);
	let ready = false;


	$: if (!hidden) {
		if (firstShown && ready) {
			console.log('first shown');
			if (onFirstShown) onFirstShown();
			firstShown = false;
			// setupEditorInContainer();
		}
	}

	function openUploadGraphModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'uploadGraphModal',
			meta: { editor }
		};
		modalStore.trigger(modal);
	}
	let isNodeBrowserHidden = false;
	let nodesToFocus: undefined | Node[] = undefined;
	function toggleNodeBrowser() {
		nodesToFocus = getVisibleNodes();
		isNodeBrowserHidden = !isNodeBrowserHidden;
	}

	$: if (nodesToFocus) {
		// console.log('focusing', nodesToFocus);

		setTimeout(() => {
			if (!nodesToFocus || nodesToFocus.length == 0) return;
			// console.log('focusing', nodesToFocus);

			AreaExtensions.zoomAt(factory.getArea(), nodesToFocus);
			nodesToFocus = undefined;
		}, 0);
	}

	function getVisibleNodes(): Node[] {
		if (!factory) {
			notifications.show({
				title: 'Error',
				message: 'No factory',
				color: 'red',
				icon: '<Fa icon={faCubesStacked} />'
			});

			return [];
		}
		const nodes = editor.getNodes();
		const area = factory.getArea();
		const visibleNodes = nodes.filter((node) => {
			const nodeView = factory.getArea().nodeViews.get(node.id);
			const containerRect = container.getBoundingClientRect();
			const elementRect = nodeView?.element.getBoundingClientRect();
			// console.log(node);

			// console.log('rect', elementRect);

			return (
				elementRect &&
				elementRect.top < containerRect.bottom &&
				elementRect.bottom > containerRect.top &&
				elementRect.left < containerRect.right &&
				elementRect.right > containerRect.left
			);
		});
		return visibleNodes;
	}
</script>

<div
	{hidden}
	class="relative border-surface-500 h-full"
	style="/*border:4px solid violet;*/ /*height:75vh;*/"
>
	<AppShell regionPage="h-full" slotSidebarLeft="h-full" slotPageContent="h-full">
		<div class="h-full">
			<!--  Overlay -->
			{#if !hidden}
				<AppShell
					class="absolute inset-0 flex justify-center items-center pointer-events-none z-10"
					slotHeader="w-full"
				>
					<!-- Toolbar -->
					<svelte:fragment slot="pageHeader">
						<div class="flex justify-between w-full p-2">
							<div class="space-x-4">
								<EditorButton onClick={toggleNodeBrowser} icon={faCubes} />
								<SaveGraphButton {editor} />
								<LoadGraphFromFileButton {factory} />
							</div>
							<div class="space-x-4">
								<DownloadGraphButton {editor} />
								<EditorButton icon={faCloud} onClick={openUploadGraphModal} />
							</div>
						</div>
					</svelte:fragment>
				</AppShell>
			{/if}
			<!-- Editor -->
			<div bind:this={container} class="h-full" class:bg-white={$modeCurrent} />
		</div>

		<!-- <svelte:fragment slot="sidebarLeft">
			{#if !isNodeBrowserHidden}
				<NodeBrowser />
			{/if}
		</svelte:fragment> -->
	</AppShell>
</div>
