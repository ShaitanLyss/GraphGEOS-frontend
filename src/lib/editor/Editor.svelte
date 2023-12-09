<script lang="ts">
	import { modeCurrent } from '@skeletonlabs/skeleton';
	export let position = 'absolute';
	// import {setupEditor} from '$rete';
	// import { onMount } from 'svelte';
	let container: HTMLElement;

	// onMount(async () => {
	// 	// await setupEditor({container, makutuClasses: {}})
	// })
</script>

<div
	bind:this={container}
	class="{position} h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
	role="region"
/>
