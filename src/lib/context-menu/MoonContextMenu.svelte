<script lang="ts">
	import {
		moonMenuPositionStore,
		moonMenuVisibleStore,
		moonMenuHideDelayStore,
		moonMenuDropConnectionStore
	} from './moonContextMenu';

	$: x = $moonMenuPositionStore.x;
	$: y = $moonMenuPositionStore.y;
	let isMouseOver = false;
	let hideTimeout: NodeJS.Timeout | undefined;



	$: {
		if (isMouseOver) {
			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		} else {
			hideTimeout = setTimeout(() => {
				$moonMenuVisibleStore = false;
				$moonMenuDropConnectionStore();
			}, $moonMenuHideDelayStore);
		}
	}
</script>

{#if $moonMenuVisibleStore}
	<div
		role="menu"
		tabindex="0"
		class="absolute variant-soft-secondary w-52 h-52 z-10"
		style="position: absolute; left: {x}px; top: {y}px;"
		on:mouseenter={() => (isMouseOver = true)}
		on:mouseleave={() => (isMouseOver = false)}
	>
		<div class="w-52 h-52 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-50">
			Yoo
		</div>
	</div>
{/if}
