<script lang="ts">
	import type { TabProps } from '$lib/layout';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	export let tabs: TabProps[] = [];
	export let tabSet: string | undefined;
	export const clearTabs: () => void = () => {
		tabs = [];
		tabSet = undefined;
	};

	$: if (tabSet === undefined && tabs.length > 0) {
		tabSet = tabs[0].id;
	}
</script>

<TabGroup regionList={'overflow-x-visible'} border="">
	{#each tabs as tab (tab.id)}
		<Tab bind:group={tabSet} value={tab.id} name={tab.name}>
			{tab.name}
		</Tab>
	{/each}
</TabGroup>
