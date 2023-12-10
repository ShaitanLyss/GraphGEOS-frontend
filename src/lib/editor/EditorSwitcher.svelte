<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications } from '$lib/global';
	import type { NodeEditor } from '$rete';
	import type { EditorExample } from '$rete/example';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let editors: NodeEditor[] = [];
	let examples: EditorExample[] = [];
	let container: HTMLElement;

	onMount(async () => {
		const { forEachExample } = await import('$rete/example');
		examples.push(forEachExample);
		examples = examples;
	});

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => undefined
	});

	setContext('onSave', () =>
		notifications.show({ title: 'Saved', message: 'TODO', color: 'green' })
	);
</script>

<div
	bind:this={container}
	class="h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
>
	<EditorSharedOverlay />
	{#each examples as example, index (example)}
		<Editor loadExample={example} />
	{/each}
</div>
