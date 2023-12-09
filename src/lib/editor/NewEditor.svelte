<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import EditorButtons from './buttons/EditorButtons.svelte';
	import EditorViewport from './EditorViewport.svelte';
</script>

<div>
	<AppShell class="absolute z-10 pointer-events-none">
		<svelte:fragment slot="pageHeader">
			<EditorButtons />
		</svelte:fragment>
	</AppShell>
	<EditorViewport />
</div>
