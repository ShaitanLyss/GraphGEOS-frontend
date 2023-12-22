<script lang="ts">
	import type { NodeEditor, NodeEditorSaveData, NodeFactory, setupEditor } from '$rete';

	import type { EditorExample } from '$rete/example/types';
	import { newUniqueId } from '$utils';
	import { _ } from '$lib/global';
	export let position = 'absolute';
	export let hidden = true;
	export let name = $_('editor.default-name');
	export let id = newUniqueId('node-editor');

	export let loadExample: EditorExample | undefined = undefined;
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { draw, fade } from 'svelte/transition';
	import { isNodeEditorSaveData } from '$rete/utils';

	export let editor: NodeEditor | undefined = undefined;
	export let factory: NodeFactory | undefined = undefined;
	export let saveData: NodeEditorSaveData | undefined = undefined;
	let container: HTMLElement;
	let editorData: Awaited<ReturnType<typeof setupEditor>>;
	const dispatch = createEventDispatcher<{ destroy: { id: string } }>();

	let placeholderVisible = false;
	setTimeout(() => (placeholderVisible = true), 500);

	let firstShown = true;
	$: if (!hidden && firstShown && editorData?.firstDisplay) {
		firstShown = false;
		console.log('firstShown');
		setTimeout(() => editorData.firstDisplay(), 0);
	}

	$: editor = editorData?.editor;
	$: factory = editorData?.factory;
	let mounted = false;
	onMount(async () => {
		await import('$rete/setup/appLaunch');
		const { setupEditor } = await import('$rete');
		editorData = await setupEditor({ container, makutuClasses: {}, loadExample, saveData });
		editorData.editor.id = id;
		editorData.editor.setName(name);
		saveData = undefined;
		mounted = true;
	});

	onDestroy(() => {
		if (editor === undefined) return;
		console.log(`Editor destroy ${editor.id}`);
		dispatch('destroy', { id: editor.id });
		editorData.destroy();
	});
</script>

{#if !mounted && !hidden && placeholderVisible}
	<div
		class="absolute h-full w-full flex justify-center items-center"
		transition:fade={{ duration: 200 }}
	>
		<!-- Loading.. -->
		<div class="card relative w-52 h-32">
			<div class="card-header">
				<div class="placeholder animate-pulse w-20" />
			</div>
			<div class="absolute right-0 translate-x-1/2 placeholder w-6 h-6 animate-pulse" />
			<div class="absolute left-0 bottom-4 -translate-x-3 flex gap-4">
				<div class=" placeholder w-6 h-6 animate-pulse" />
				<div class=" placeholder w-20 h-4 my-auto animate-pulse" />
			</div>
		</div>
	</div>
{/if}
<div
	bind:this={container}
	class:opacity-0={!mounted || hidden}
	class="{position} transition-opacity h-full w-full bg-none {hidden
		? 'opacity-0 pointer-events-none'
		: ''}"
	role="region"
/>
