<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { setupEditor } from '../rete/editor';
	import type { EditorExample } from '../rete/example/types';

	export let loadExample: EditorExample;
	export let hidden = false;

	let firstShown = true;

	let container: HTMLDivElement;
	let destroyEditor: Function;
	let onFirstShown: Function;

	$: if (!hidden) {
		if (firstShown && onFirstShown) {
			firstShown = false;
			// onFirstShown();
			console.log("first shown");
			
		}
	}

	onMount(async () => {
		const tools = (await setupEditor(container, loadExample));
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		return () => {
			destroyEditor();
			console.log('destroyed');
		};
	});
</script>

<div {hidden} bind:this={container} style="border:4px solid violet; height:75vh;" />
