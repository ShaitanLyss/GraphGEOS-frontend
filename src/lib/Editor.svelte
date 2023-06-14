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

	onMount(async () => {
		const tools = (await setupEditor(container, loadExample));
		destroyEditor = tools.destroy;
		onFirstShown = tools.firstDisplay;
		return () => {
			destroyEditor();
			console.log('destroyed');
		};
	});

	$: if (!hidden) {
		if (firstShown && onFirstShown) {
			onFirstShown();
			firstShown = false;
			console.log("first shown");
			
		}
	}
</script>

<div {hidden} bind:this={container} style="border:4px solid violet; height:75vh;" />
