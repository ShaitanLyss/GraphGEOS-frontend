<script lang="ts">
	import type { TabProps } from '$lib/layout';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { fade, fly } from 'svelte/transition';

	export let tabs: TabProps[] = [];
	export let tabSet: string | undefined;
	export const clearTabs: () => void = () => {
		tabSet = undefined;
		tabs = [];
	};

	$: if (tabSet === undefined && tabs.length > 0) {
		tabSet = tabs[0].id;
	}
</script>

<TabGroup regionList={'overflow-x-visible'} border="">
	{#each tabs as tab (tab.id)}
		<div in:fly={{ y: '100%' }} out:fade={{ duration: 100 }}>
			<Tab bind:group={tabSet} value={tab.id} name={tab.name}>
				{tab.name}
			</Tab>
		</div>
	{/each}
</TabGroup>
