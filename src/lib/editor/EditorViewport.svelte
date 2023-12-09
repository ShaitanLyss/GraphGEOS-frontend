<script lang="ts">
	import { modeCurrent } from '@skeletonlabs/skeleton';

	export let position = 'absolute';
</script>

<div class="{position} h-full w-full" class:bg-white={$modeCurrent} />
