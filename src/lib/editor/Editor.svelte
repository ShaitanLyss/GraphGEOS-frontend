<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';

	import type { EditorExample } from '../../rete/example/types';
	import { AppShell, ModalSettings, modeCurrent } from '@skeletonlabs/skeleton';
	import { faCloud, faCubes, faCubesStacked, faEarth } from '@fortawesome/free-solid-svg-icons';
	import { faPython } from '@fortawesome/free-brands-svg-icons';
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
	import { page } from '$app/stores';

	import { notifications } from '@mantine/notifications';
	import ToPythonButton from './ToPythonButton.svelte';
	import type { MakutuClassesStore } from '$houdini';
	import type { MakutuClassRepository } from '../../backend-interaction/types';
	import ToggleGeosButton from './ToggleGeosButton.svelte';
	import GeosDashboard from '$lib/geos/GeosDashboard.svelte';

	// import {} from '@fortawesome/free-regular-svg-icons';

	export let loadExample: EditorExample | undefined = undefined;
	export let hidden = false;
	export let name: string;
	let ready = false;
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
		const tools = await setupEditor(container, makutuClassRepository, loadExample);
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		editor = tools.editor;
		editor.setName(name);
		editor.addOnChangeNameListener(onNameChange);
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
	let showRightSidebar = true;
	setContext('toggleGeos', () => {
		showRightSidebar = !showRightSidebar;
	});
</script>

<div
	hidden={hidden && ready}
	class="absolute inset-0 border-surface-500 h-full"
	style="z-index: {hidden ? -10 : 0};"
	class:opacity-0={hidden && !ready}
>
	<AppShell regionPage="h-full" slotSidebarLeft="h-full" slotPageContent="h-full">
		<div class="h-full">
			<!--  Overlay -->
			{#if !hidden}
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
								<SaveGraphButton {editor} />
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
				class="h-full"
				class:bg-white={$modeCurrent}
				style="z-index: {hidden ? -10 : 10};"
			/>
		</div>

		<!-- <svelte:fragment slot="sidebarLeft">
			{#if !isNodeBrowserHidden}
				<NodeBrowser />
			{/if}
		</svelte:fragment> -->
	</AppShell>
</div>
