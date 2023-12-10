<script lang="ts">
	import type { setupEditor } from '$rete';
	import type { EditorExample } from '$rete/example/types';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	export let position = 'absolute';
	export let loadExample: EditorExample | undefined = undefined;
	import { onDestroy, onMount } from 'svelte';
	let container: HTMLElement;

	let editorData: Awaited<ReturnType<typeof setupEditor>>;
	onMount(async () => {
		const { setupEditor } = await import('$rete');
		editorData = await setupEditor({ container, makutuClasses: {}, loadExample });
		await editorData.firstDisplay();
	});
	onDestroy(() => {
		editorData?.destroy();
	});
</script>

<div bind:this={container} class="{position} h-full w-full bg-none" role="region" />
