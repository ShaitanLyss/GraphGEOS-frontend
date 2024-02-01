<!-- BoxSelection.svelte -->
<script lang="ts">
	import type { Point } from '$lib/types/Point';

	export let a: Point;
	export let b: Point;

	export let upperLeft: Point = { x: 0, y: 0 };
	export let lowerRight: Point = { x: 0, y: 0 };
	$: upperLeft = {
		x: Math.min(a.x, b.x),
		y: Math.min(a.y, b.y)
	};

	$: lowerRight = {
		x: Math.max(a.x, b.x),
		y: Math.max(a.y, b.y)
	};
	export let box: HTMLElement | undefined = undefined;

	$: if (box) {
		box.style.left = `${upperLeft.x}px`;
		box.style.top = `${upperLeft.y}px`;
		box.style.width = `${lowerRight.x - upperLeft.x}px`;
		box.style.height = `${lowerRight.y - upperLeft.y}px`;
	}
</script>

<div
	bind:this={box}
	class="absolute marquee-border border-2 border-secondary-500 border-dashed rounded w-full h-32"
></div>
