<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import { EditorButtons } from './buttons';
	import { VariablesListOverlay } from './overlay';
</script>

<AppShell class="absolute z-10 pointer-events-none">
	<svelte:fragment slot="pageHeader">
		<EditorButtons />
	</svelte:fragment>
	<svelte:fragment slot="pageFooter">
		<VariablesListOverlay />
	</svelte:fragment>
</AppShell>
