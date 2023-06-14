<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { localStorageStore } from '@skeletonlabs/skeleton';

	import type { Writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import { sumExample } from '../rete/example/math';
	import { forEachExample } from '../rete/example/for_each';
	import { timeloopExample } from '../rete/example/timeloop';
	import { acquisitionModelingExample } from '../rete/example/acquisition-modeling';
	import { onMount } from 'svelte';

	type tab = 'math' | 'timeloop' | 'for_each' | 'acquisition';

	const tabSet: Writable<tab> = localStorageStore('exampleTabSet', 'math');
	let ready = false;

	onMount(() => {
		ready = true;
	});
</script>

{#if ready}
	<TabGroup>
		<Tab bind:group={$tabSet} name="tab1" value={'math'}>Math</Tab>
		<Tab bind:group={$tabSet} name="tab3" value={'for_each'}>For Each</Tab>
		<Tab bind:group={$tabSet} name="tab2" value={'timeloop'}>Time Loop</Tab>
		<Tab bind:group={$tabSet} name="tab3" value={'acquisition'}>Acquisition Modelling</Tab>
		<div slot="panel">
			<Editor hidden={$tabSet !== 'math'} loadExample={sumExample} />
			<Editor hidden={$tabSet !== 'for_each'} loadExample={forEachExample} />
			<Editor hidden={$tabSet !== 'timeloop'} loadExample={timeloopExample} />
			<Editor hidden={$tabSet !== 'acquisition'} loadExample={acquisitionModelingExample} />
		</div>
	</TabGroup>
{:else}
	<section class="card w-full">
		<div class="card-header flex justify-between items-center">
			<div class="flex justify-center items-center space-x-4" class:animate-pulse={true}>
				<div class="placeholder-circle w-16" />
				<div class="placeholder-circle w-14" />
				<div class="placeholder-circle w-10" />
			</div>
		</div>
		<div class="p-4 space-y-4" class:animate-pulse={true}>
			<div class="placeholder" />
			<div class="grid grid-cols-4 gap-4">
				<div class="placeholder" />
				<div class="placeholder" />
				<div class="placeholder" />
				<div class="placeholder" />
			</div>
			<div class="placeholder" />
			<div class="placeholder" />
		</div>
	</section>
{/if}
