<script lang="ts">
	import { modeCurrent } from '@skeletonlabs/skeleton';
	export let position = 'absolute';
</script>

<div
	class="{position} h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
	role="region"
/>
