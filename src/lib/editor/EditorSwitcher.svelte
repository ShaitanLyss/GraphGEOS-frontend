<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications } from '$lib/global';

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
