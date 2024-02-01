<script lang="ts">
	import BoxMarquee from '$lib/primitives/BoxMarquee.svelte';
	import BoxSelection from '$lib/editor/selection/BoxSelection.svelte';
	let container: HTMLElement;
</script>

<div bind:this={container} class="h-full w-full bg-orange-200">
	<BoxSelection target={container} />
</div>
