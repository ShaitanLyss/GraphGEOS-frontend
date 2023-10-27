<script lang="ts">
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import '../rete/imports';
	import { sumExample } from '$rete/example/math';
	import { timeloopExample } from '$rete/example/timeloop';
	import { forEachExample } from '$rete/example/for_each';
	import { acquisitionModelingExample } from '$rete/example/acquisition-modeling';
	import { acquisitionXmlExample } from '$rete/example/acquisition-xml';
	import { graphql } from '$houdini';
	import { isTauri } from '$utils/tauri';
	import { isLoading } from 'svelte-i18n';
	import { macroNodeExample } from '$rete/example/R_macro_node_E';
	const store = graphql(`
		query TestQuery @load {
			graphs {
				name
			}
		}
	`);
	$: console.log('store', $store.data);
</script>

<svelte:head>
	<title>Geos UI</title>
</svelte:head>
<div class="h-screen">
	<AppShell regionPage="h-full" slotPageContent="h-full">
		<!-- <svelte:fragment slot="sidebarLeft">Sidebar left</svelte:fragment> -->
		<svelte:fragment slot="sidebarLeft" />
		<!-- <a href="/auth">Login</a> -->
		<EditorSwitcher
			defaultTabSet="acquisition"
			examples={[
				// { key: 'math', example: sumExample, label: 'Math' },
				// { key: 'timeloop', example: timeloopExample, label: 'Time Loop' },
				// { key: 'for_each', example: forEachExample, label: 'For Each' },
				{ key: 'acquisition', example: acquisitionModelingExample, label: 'Workflow : Acquisition Modelling' },
				// { key: 'xml', example: acquisitionXmlExample, label: 'XML' },
				// { key: 'macroNode', example: macroNodeExample, label: 'Macro Node' }
			]}
		/>
	</AppShell>
</div>
