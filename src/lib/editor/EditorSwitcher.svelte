<script lang="ts">
	import Editor from '$lib/editor/NewEditor.svelte';
	import EditorSharedOverlay from './EditorSharedOverlay.svelte';
	import { setContext } from '$lib/global';
	import { notifications } from '@mantine/notifications';
	let editors: number[] = [1];
	let container: HTMLElement;

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => undefined
	});

	setContext('onSave', () =>
		notifications.show({ title: 'Saved', message: 'TODO', color: 'green' })
	);
</script>

<div bind:this={container}>
	<EditorSharedOverlay />
	{#each editors as editor, index (editor)}
		<Editor />
	{/each}
</div>
