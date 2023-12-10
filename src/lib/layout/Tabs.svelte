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

<TabGroup regionList={'overflow-x-visible overflow-y-hidden'} border="">
	{#if tabs.length > 0}
		<div
			class="h-full"
			data-comment-
			in:fly={{ y: '100%' }}
			out:fly={{ x: '-100%', duration: 400 }}
		>
			{#each tabs as tab (tab.id)}
				<Tab bind:group={tabSet} value={tab.id} name={tab.name}>
					{tab.name}
				</Tab>
			{/each}
		</div>
	{/if}
</TabGroup>
