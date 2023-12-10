<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications } from '$lib/global';
	import type { NodeFactory } from '$rete';
	import type { EditorExample } from '$rete/example';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let factories: NodeFactory[] = [];
	let examples: EditorExample[] = [];
	let container: HTMLElement;
	let activeFactory: NodeFactory | undefined;

	onMount(async () => {
		const { forEachExample } = await import('$rete/example');
		examples.push(forEachExample);
		examples = examples;
	});

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => activeFactory
	});

	setContext('onSave', () =>
		notifications.show({ title: 'Saved', message: 'TODO', color: 'green' })
	);
	$: if (factories.length > 0) {
		activeFactory = factories[0];
	}
</script>

<div
	bind:this={container}
	class="h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
>
	<EditorSharedOverlay />
	{#each examples as example, index (example)}
		<Editor bind:factory={factories[index]} loadExample={example} hidden={index != 0} />
	{/each}
</div>
