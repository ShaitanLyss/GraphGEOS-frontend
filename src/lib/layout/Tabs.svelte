<script lang="ts">
	import { ErrorWNotif } from '$lib/global';
	import type { AddModel, AddModelProps, SetMainAddModel, TabContext, TabProps } from '$lib/layout';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';

	let tabs: Map<string, TabProps> = new Map();
	let tabSet: Writable<string | undefined> = writable();

	export const tabsContext: TabContext = {
		tabSet,
		clearTabs() {
			tabs.clear();
			tabs = tabs;
			$tabSet = undefined;
			mainAddModel = undefined;
		},
		setMainAddModel(option) {
			mainAddModel = option;
		},
		addTab({ key, props }) {
			if (tabs.has(key)) throw new ErrorWNotif({ emessage: 'Tab already exists' });
			tabs.set(key, props);
			tabs = tabs;
			$tabSet = key;
		},
		deleteTab(key) {
			tabs.delete(key);
			tabs = tabs;
		}
	};

	let mainAddModel: AddModelProps | undefined;

	$: if (tabSet === undefined && tabs.size > 0) {
		$tabSet = tabs.keys().next().value;
	}
	let addButtonSet: string | undefined = undefined;
	$: if (addButtonSet !== undefined) addButtonSet = undefined;
</script>

<TabGroup regionList={'overflow-x-visible overflow-y-hidden'} border="">
	{#each tabs as [key, tab] (key)}
		<div class="h-full" in:fly={{ y: '100%' }} out:fly={{ x: '-100%', duration: 400 }}>
			<Tab bind:group={$tabSet} value={key} name={tab.name} regionTab="">
				{tab.name}
			</Tab>
		</div>
	{/each}
	{#if mainAddModel}
		<div class="h-full" in:fly={{ y: '100%' }} out:fly={{ x: '-100%', duration: 400 }}>
			<Tab
				on:click={mainAddModel.addModel}
				bind:group={addButtonSet}
				name="addTab"
				value={'mainAdd'}>+</Tab
			>
		</div>
	{/if}
</TabGroup>
