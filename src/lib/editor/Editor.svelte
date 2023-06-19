<script lang="ts">
	import { onMount } from 'svelte';
	import { setupEditor } from '$rete/editor';
	import type { EditorExample } from '../../rete/example/types';
	import { AppShell, ModalSettings, modeCurrent } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faCloud } from '@fortawesome/free-solid-svg-icons';
	import { modalStore } from '@skeletonlabs/skeleton';
	import DownloadGraphButton from '$lib/editor/DownloadGraphButton.svelte';
	import SaveGraphButton from './SaveGraphButton.svelte';
	import EditorButton from './EditorButton.svelte';
	import LoadGraphFromFileButton from './LoadGraphFromFileButton.svelte';
	import type { NodeFactory } from '$rete/node/NodeFactory';
	import type { NodeEditor } from '$rete/NodeEditor';
	import OpenGraphDrawer from './OpenGraphDrawer.svelte';

	// import {} from '@fortawesome/free-regular-svg-icons';

	export let loadExample: EditorExample | undefined;
	export let hidden = false;
	export let name: string;
	export let onNameChange: (name: string) => void = () => {};

	let firstShown = true;

	let container: HTMLDivElement;
	let editor: NodeEditor;
	let factory: NodeFactory;

	let destroyEditor: Function;
	let onFirstShown: Function;

	onMount(async () => {
		const tools = await setupEditor(container, loadExample);
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		editor = tools.editor;
		editor.setName(name);
		editor.addOnChangeNameListener(onNameChange);
		factory = tools.factory;

		return () => {
			destroyEditor();
			console.log('destroyed');
		};
	});
	$: if (editor) editor.setName(name, false);

	$: if (!hidden) {
		if (firstShown && onFirstShown) {
			onFirstShown();
			firstShown = false;
			console.log('first shown');
		}
	}

	function openUploadGraphModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'uploadGraphModal',
			meta: {editor}

		};
		modalStore.trigger(modal);
	}
</script>

<div
	{hidden}
	class="relative border border-surface-500"
	style="/*border:4px solid violet;*/ height:75vh;"
>
	<div bind:this={container} style="height:100%;" class:bg-white={$modeCurrent} />

	<!--  Overlay -->
	{#if !hidden}
		<AppShell
			class="absolute inset-0 flex justify-center items-center pointer-events-none"
			slotHeader="w-full"
		>
			<svelte:fragment slot="header">
				<div class="flex justify-between w-full p-2">
					<div class="space-x-4">
						<OpenGraphDrawer {editor} />
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
</div>
