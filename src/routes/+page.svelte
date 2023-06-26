<script>
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import '../rete/imports';
	import { sumExample } from '$rete/example/math';
	import { timeloopExample } from '$rete/example/timeloop';
	import { forEachExample } from '$rete/example/for_each';
	import { acquisitionModelingExample } from '$rete/example/acquisition-modeling';
</script>

<div class="h-screen">
	<AppShell regionPage="h-full" slotPageContent="h-full">
		<!-- <svelte:fragment slot="sidebarLeft">Sidebar left</svelte:fragment> -->
		<svelte:fragment slot="sidebarLeft" />
		<EditorSwitcher
			examples={[
				// { key: 'math', example: sumExample, label: 'Math' },
				// { key: 'timeloop', example: timeloopExample, label: 'Time Loop' },
				{ key: 'for_each', example: forEachExample, label: 'For Each' }
				// { key: 'acquisition', example: acquisitionModelingExample, label: 'Acquisition Modelling' }
			]}
		/>
	</AppShell>
</div>
