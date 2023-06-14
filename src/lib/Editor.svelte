<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { setupEditor } from "../rete/editor";
	import type { EditorExample } from "../rete/example/types";

	export let loadExample: EditorExample;
	export let hidden = false;

	let container: HTMLDivElement;
	let destroyEditor: Function;

	onMount(async () => {
		destroyEditor = (await setupEditor(container, loadExample)).destroy;
		return () => {destroyEditor(); console.log("destroyed");
		};
	});
	
</script>

<div {hidden} bind:this={container} style="border:4px solid violet; height:75vh;" />
