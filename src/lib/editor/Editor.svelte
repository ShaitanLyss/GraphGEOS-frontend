<script lang="ts">
	import {  onMount } from 'svelte';
	import { setupEditor } from '$rete/editor';
	import type { EditorExample } from '../../rete/example/types';
	import { AppShell, ModalSettings, modeCurrent } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faCloud } from '@fortawesome/free-solid-svg-icons';
	import { modalStore } from '@skeletonlabs/skeleton';
	import DownloadGraphButton from '$lib/editor/DownloadGraphButton.svelte';
	import SaveGraphButton from './SaveGraphButton.svelte';
	import EditorButton from './EditorButton.svelte';
	
	// import {} from '@fortawesome/free-regular-svg-icons';

	export let loadExample: EditorExample | undefined;
	export let hidden = false;

	let firstShown = true;

	let container: HTMLDivElement;
	let editor: any;
	let destroyEditor: Function;
	let onFirstShown: Function;

	onMount(async () => {
		const tools = await setupEditor(container, loadExample);
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		editor = tools.editor;
		return () => {
			destroyEditor();
			console.log('destroyed');
		};
	});

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
		}
		modalStore.trigger(modal);

	}
</script>

<div {hidden} class="relative border border-surface-500" style="/*border:4px solid violet;*/ height:75vh;">
	<div bind:this={container} style="height:100%;" class:bg-white={$modeCurrent}/>

	<!--  Overlay -->
	{#if !hidden}
		<AppShell
			class="absolute inset-0 flex justify-center items-center pointer-events-none"
			slotHeader="w-full"
		>
			<svelte:fragment slot="header">
				<div class="flex justify-between w-full p-2">
					<div class="space-x-4">
						<SaveGraphButton/>
					</div>
					<div class="space-x-4">
						<DownloadGraphButton {editor}/>
						<EditorButton
							icon={faCloud}
							onClick={openUploadGraphModal}
						/>
					</div>
				</div>
			</svelte:fragment>
		</AppShell>
	{/if}
</div>
