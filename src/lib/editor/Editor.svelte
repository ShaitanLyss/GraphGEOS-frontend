<script lang="ts">
	import type { NodeEditor, NodeFactory, setupEditor } from '$rete';
	import type { EditorExample } from '$rete/example/types';
	import { newUniqueId } from '$utils';
	export let position = 'absolute';
	export let hidden = true;

	export let loadExample: EditorExample | undefined = undefined;
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	export let editor: NodeEditor | undefined = undefined;
	export let factory: NodeFactory | undefined = undefined;

	let container: HTMLElement;
	let editorData: Awaited<ReturnType<typeof setupEditor>>;
	const dispatch = createEventDispatcher<{ destroy: { id: string } }>();

	let firstShown = true;
	$: if (!hidden && firstShown && editorData?.firstDisplay) {
		firstShown = false;
		console.log('firstShown');
		setTimeout(() => editorData.firstDisplay(), 0);
	}

	$: editor = editorData?.editor;
	$: factory = editorData?.factory;

	onMount(async () => {
		await import('$rete/setup/appLaunch');
		const { setupEditor } = await import('$rete');
		editorData = await setupEditor({ container, makutuClasses: {}, loadExample });
	});

	onDestroy(() => {
		if (editor === undefined) return;
		console.log(`Editor destroy ${editor.id}`);
		dispatch('destroy', { id: editor.id });
		editorData.destroy();
	});
</script>

<div
	bind:this={container}
	class="{position} h-full w-full bg-none {hidden ? 'opacity-0 pointer-events-none' : ''}"
	role="region"
/>
