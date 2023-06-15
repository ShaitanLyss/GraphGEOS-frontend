<script lang="ts">
	import { TabGroup, Tab, LightSwitch } from '@skeletonlabs/skeleton';
	import { localStorageStore } from '@skeletonlabs/skeleton';

	import type { Writable } from 'svelte/store';
	import Editor from './editor/Editor.svelte';
	import { sumExample } from '../rete/example/math';
	import { forEachExample } from '../rete/example/for_each';
	import { timeloopExample } from '../rete/example/timeloop';
	import { acquisitionModelingExample } from '../rete/example/acquisition-modeling';
	import { onMount } from 'svelte';
	import type { EditorExample } from '../rete/example/types';

	type Editor = { key: string; example?: EditorExample; label?: string };
	let addButonClicked = -1;

	let editors: Editor[] = [
		{ key: 'math', example: sumExample, label: 'Math' },
		{ key: 'timeloop', example: timeloopExample, label: 'Time Loop' },
		{ key: 'for_each', example: forEachExample, label: 'For Each' },
		{ key: 'acquisition', example: acquisitionModelingExample, label: 'Acquisition Modelling' }
	];

	const tabSet: Writable<string> = localStorageStore('exampleTabSet', 'math');
	let ready = false;

	onMount(() => {
		ready = true;
	});

	function addEditor() {
		console.log('addEditor');
		const key = `newEditor${editors.length}`;
		editors = [...editors, { key: key, label: 'New Editor' }];
		$tabSet = key;
		setTimeout(() => {
			addButonClicked = -1;
		}, 0);

		// editors.push({key: "new", label: "New"});
	}
</script>

{#if ready}
	<TabGroup>
		{#each editors as editor, index (index)}
			<Tab bind:group={$tabSet} name="tab{index}" value={editor.key}>{editor.label}</Tab>
		{/each}
		<Tab on:click={addEditor} bind:group={addButonClicked} name="addEditorBtn" value={undefined}
			>+</Tab
		>
		<!-- <Tab bind:group={$tabSet} name="tab1" value={'math'}>Math</Tab>
		<Tab bind:group={$tabSet} name="tab3" value={'for_each'}>For Each</Tab>
		<Tab bind:group={$tabSet} name="tab2" value={'timeloop'}>Time Loop</Tab>
		<Tab bind:group={$tabSet} name="tab3" value={'acquisition'}>Acquisition Modelling</Tab> -->
		<div slot="panel">
			{#each editors as editor, index (index)}
				<Editor hidden={$tabSet !== editor.key} loadExample={editor.example} />
			{/each}
		</div>
		<div class="ml-auto pe-4 my-auto">
			<LightSwitch />
		</div>
	</TabGroup>
{:else}
	<div class="flex justify-left space-x-4 p-4">
		<div class="placeholder w-12" />
		<div class="placeholder w-20" />
		<div class="placeholder w-20" />
		<div class="placeholder w-24" />
	</div>
	<section class="card w-full h-96">
		<div class="card-header flex justify-between items-center">
			<div class="flex justify-center items-center space-x-4" class:animate-pulse={true}>
				<div class="placeholder-circle w-16" />
				<div class="placeholder-circle w-14" />
				<div class="placeholder-circle w-10" />
			</div>
		</div>
		<div class="p-4 space-y-4 h-full" class:animate-pulse={true}>
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
