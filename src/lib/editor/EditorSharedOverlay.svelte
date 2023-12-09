<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import { EditorButtons } from './buttons';
</script>

<AppShell class="absolute z-10 pointer-events-none">
	<svelte:fragment slot="pageHeader">
		<EditorButtons />
	</svelte:fragment>
</AppShell>
