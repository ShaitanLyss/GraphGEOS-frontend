<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';

	import type { EditorExample } from '../../rete/example/types';
	import { AppShell, ModalSettings, modeCurrent } from '@skeletonlabs/skeleton';
	import { faCloud, faCubes, faCubesStacked, faEarth } from '@fortawesome/free-solid-svg-icons';
	import { faPython } from '@fortawesome/free-brands-svg-icons';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import DownloadGraphButton from '$lib/editor/DownloadGraphButton.svelte';
	import SaveGraphButton from './SaveGraphButton.svelte';
	import EditorButton from './EditorButton.svelte';
	import LoadGraphFromFileButton from './LoadGraphFromFileButton.svelte';
	import type { NodeFactory } from '$rete/node/NodeFactory';
	import type { NodeEditor, NodeEditorSaveData } from '$rete/NodeEditor';
	import OpenGraphDrawer from './OpenGraphDrawer.svelte';
	import NodeBrowser from './node-browser/NodeBrowser.svelte';
	import { AreaExtensions } from 'rete-area-plugin';
	import type { Node } from '$rete/node/Node';
	import { page } from '$app/stores';

	import { notifications } from '@mantine/notifications';
	import ToPythonButton from './ToPythonButton.svelte';
	import { GetGraphStore, type MakutuClassesStore } from '$houdini';
	import type { MakutuClassRepository } from '../../backend-interaction/types';
	import ToggleGeosButton from './ToggleGeosButton.svelte';
	import GeosDashboard from '$lib/geos/GeosDashboard.svelte';
	import type { UploadGraphModalMeta } from '$lib/modals/types';
	import { MacroNode } from '$rete/node/MacroNode';
	import type { UUID } from 'crypto';
	import {
		clientToSurfacePos,
		getScale,
		getTranslateValues,
		translateNodeFromGlobal
	} from '$utils/html';
	import { spawnMoonMenu } from '$lib/context-menu/moonContextMenu';
	import type { ConnectionDropEvent } from '$rete/setup/ConnectionSetup';

	// import {} from '@fortawesome/free-regular-svg-icons';

	const modalStore = getModalStore();

	export let loadExample: EditorExample | undefined = undefined;
	export let hidden = false;
	export let name: string;
	export let saveData: NodeEditorSaveData | undefined = undefined;
	let ready = false;

	export let onNameChange: ((name: string) => void) | undefined = undefined;

	let firstShown = true;

	let container: HTMLDivElement;
	export let editor: NodeEditor | undefined = undefined;

	let factory: NodeFactory;

	let destroyEditor: () => void;
	let onFirstShown: () => Promise<void>;

	let debouncedTimer: NodeJS.Timeout | undefined;
	function debouncedHandler(handler: () => void, timeout = 500) {
		if (debouncedTimer) clearTimeout(debouncedTimer);
		debouncedTimer = setTimeout(handler, timeout);
	}

	const makutuClassesStore: MakutuClassesStore = $page.data.MakutuClasses;
	const makutuClasses = $makutuClassesStore.data?.makutuClasses;
	const makutuClassRepository: MakutuClassRepository = {};

	$: if (makutuClasses) {
		makutuClasses.forEach((makutuClass) => {
			makutuClassRepository[makutuClass.name] = makutuClass;
		});
	}

	onMount(async () => {
		// const { createEditor } = await import('./editor');
		// await createEditor(container);
		if (makutuClasses === undefined) {
			notifications.show({
				title: 'Error',
				message: 'Makutu classes not loaded',
				color: 'red'
			});
			throw new Error('Makutu classes not loaded');
		}

		const { setupEditor } = await import('$rete/editor');
		if (!container) return;
		const tools = await setupEditor(container, makutuClassRepository, loadExample, saveData);
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		editor = tools.editor;
		editor.setName(name);
		if (onNameChange) editor.addOnChangeNameListener(onNameChange);
		factory = tools.factory;

		AreaExtensions.zoomAt(factory.getArea(), factory.getEditor().getNodes());
		// const { watchResize } = await import('svelte-watch-resize');
		// watchResize(container, () => {
		// 	if (nodesToFocus === undefined) {
		// 		nodesToFocus = getVisibleNodes();
		// 	}
		// 	// debouncedHandler(() => console.log('resize'));
		// });
		ready = true;
	});

	onDestroy(() => {
		if (destroyEditor) destroyEditor();
		console.log('destroyed');
	});
	$: if (editor) editor.setName(name, false);

	$: if (!hidden) {
		if (firstShown && ready) {
			console.log('first shown');
			setTimeout(() => {
				onFirstShown().then(() => (firstShown = false));
				// AreaExtensions.zoomAt(factory.getArea(), factory.getEditor().getNodes());
			}, 0);

			// setupEditorInContainer();
		}
	}

	function openUploadGraphModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'uploadGraphModal',
			meta: { editor } as UploadGraphModalMeta
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
		console.log('focusing', nodesToFocus);

		setTimeout(() => {
			if (!nodesToFocus || nodesToFocus.length == 0) return;
			console.log('focusing', nodesToFocus);

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
	let showRightSidebar = false;
	setContext('toggleGeos', () => {
		showRightSidebar = !showRightSidebar;
	});

	async function onDrop(event: DragEvent) {
		const graphId = event.dataTransfer?.getData('rete/macronode') as UUID;
		if (!graphId) throw new Error('No graph id');
		const graph = (await new GetGraphStore().fetch({ variables: { id: graphId } })).data?.graph;
		if (!graph) throw new Error('Graph not found');
		console.log('Dropped', graph.name);
		const saveData: NodeEditorSaveData = JSON.parse(graph.data);
		const node = await factory.addNode(MacroNode, { saveData: saveData, graphId });
		if (!node) throw new Error('Node not created');
		// Move node to drop position
		translateNodeFromGlobal({ globalPos: { x: event.clientX, y: event.clientY }, node, factory });

		// nodeView.translate(event.clientX - surfacePos.x, event.clientY - surfacePos.y);
	}

	function onConnectionDrop(event: ConnectionDropEvent) {
		console.log('connection drop on editor', event.socketData);

		spawnMoonMenu({ connDropEvent: event, drop: () => this.drop() });
	}
</script>

<!-- 
<div
	hidden={hidden && ready}
	class="absolute inset-0 border-surface-500 h-full"
	style="z-index: {hidden ? -10 : 0};"
	class:opacity-0={hidden && !ready}
> -->
<div
	class="absolute inset-0 border-surface-500 h-full "
	style="z-index: {hidden ? -10 : 0};"
	class:opacity-0={hidden}
	class:pointer-events-none={hidden}

>
	<AppShell regionPage="h-full" slotSidebarLeft="h-full" slotPageContent="h-full">
		<div class="h-full">
			<!--  Overlay -->
			{#if !hidden && editor !== undefined}
				<AppShell
					class="absolute inset-0 flex justify-center items-center pointer-events-none z-10"
					slotHeader="w-full"
					slotSidebarRight={showRightSidebar
						? 'w-1/3 sm:w-2/7 lg:w-2/5 xl:w-1/5 bg-surface-50-90-token'
						: ''}
				>
					<!-- Toolbar -->
					<svelte:fragment slot="pageHeader">
						<div class="flex justify-between w-full p-2">
							<div class="space-x-4">
								<!-- <EditorButton onClick={toggleNodeBrowser} icon={faCubes} /> -->
								<SaveGraphButton />
								<LoadGraphFromFileButton {factory} />
								<ToPythonButton {factory} {container} />
							</div>
							<div class="space-x-4">
								<DownloadGraphButton {editor} />
								<EditorButton icon={faCloud} on:click={openUploadGraphModal} />
								<ToggleGeosButton />
							</div>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="sidebarRight">
						{#if showRightSidebar}
							<GeosDashboard padding="py-8 px-4 md:px-12" width="w-full" variant="" />
						{/if}
					</svelte:fragment>
				</AppShell>
			{/if}
			<!-- Editor -->
			<div
				bind:this={container}
				role="region"
				class="h-full"
				class:bg-white={$modeCurrent}
				style="z-index: {hidden ? -10 : 10};"
				on:connectiondrop={onConnectionDrop}
				on:dragenter={(event) => {
					if (event.dataTransfer?.types[0] === 'rete/macronode') event.preventDefault();
				}}
				on:dragover={(event) => {
					if (event.dataTransfer?.types[0] === 'rete/macronode') event.preventDefault();
				}}
				on:drop|preventDefault={onDrop}
			/>
		</div>

		<!-- <svelte:fragment slot="sidebarLeft">
			{#if !isNodeBrowserHidden}
				<NodeBrowser />
			{/if}
		</svelte:fragment> -->
	</AppShell>
</div>
