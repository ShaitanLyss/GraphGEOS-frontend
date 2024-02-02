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

<!-- <svg class="absolute w-full h-full " id="lasso">
	<polygon class="stroke-secondary-500 dark:stroke-secondary-400
	dfill-secondary-400 ddark:fill-secondary-500" points={`${a.x},${a.y} ${b.x},${a.y} ${b.x},${b.y} ${a.x},${b.y}`} />
	" points={`${a.x},${a.y} ${b.x},${a.y} ${b.x},${b.y} ${a.x},${b.y}`} />
</svg> -->
<div
	bind:this={box}
	class="absolute marquee-border border-2 border-secondary-500 border-dashed rounded w-full h-32"
></div>

<!-- <style>
	@keyframes dash {
		100% {
			stroke-dashoffset: 15;
		}
	}
	#lasso polygon {
		/* stroke: #6c7fe9ad; */
		stroke-dasharray: 10 5;
		stroke-width: 2;
		fill: rgba(144, 161, 255, 0.21);
		-webkit-animation: dash 1s linear infinite;
		animation: dash 1s linear infinite;
		z-index: 5;
	}
</style> -->
