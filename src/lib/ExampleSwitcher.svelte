<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { localStorageStore } from '@skeletonlabs/skeleton';

	import type { Writable } from 'svelte/store';
	import Editor from '../rete/Editor.svelte';
	import { sumExample } from '../rete/example/math';

	type tab = 'math' | 'timeloop' | 'for_each' | 'acquisition';

	const tabSet: Writable<tab> = localStorageStore('exampleTabSet', 'math');
</script>

<TabGroup>
	<Tab bind:group={$tabSet} name="tab1" value={'math'}>Math</Tab>
	<Tab bind:group={$tabSet} name="tab3" value={'for_each'}>For Each</Tab>
	<Tab bind:group={$tabSet} name="tab2" value={'timeloop'}>Time Loop</Tab>
	<Tab bind:group={$tabSet} name="tab3" value={'acquisition'}>Acquisition Modelling</Tab>
	<div slot="panel">
		<Editor hidden={$tabSet !== 'math'} loadExample={sumExample} />
		<Editor hidden={$tabSet !== 'for_each'} loadExample={sumExample} />
	</div>

	<!-- 
    <svelte:fragment slot="panel">
		{#if $tabSet === "math"}
			<Editor/>
		{:else if $tabSet === "for_each"}
			(tab panel 2 contents)
		{:else if $tabSet === "timeloop"}
			(tab panel 3 contents)
        {:else if $tabSet === "acquisition"}
            (tab panel 4 contents)
		{/if} -->
	<!-- </svelte:fragment> -->
</TabGroup>
