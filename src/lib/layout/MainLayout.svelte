<script lang="ts">
	import {
		setContext,
		GlobalPopups,
		RightSidebar,
		makeGlobalPopupContext,
		makeGlobalPopupsProps
	} from '$lib/global';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { MainHeader, type TabContext } from '$lib/layout';
	import type { SvelteComponent } from 'svelte';

	const tabs: TabContext['tabs'] = writable([]);
	let tabSet: TabContext['tabSet'] = writable();
	let clearTabs: TabContext['clearTabs'] = writable();

	const tabContext: TabContext = {
		tabs: tabs,
		tabSet,
		clearTabs
	};
	const numGlobalTooltips = 3;
	let tooltipUseCount = 0;
	setContext('globalPopups', {
		nextPopupKey: () => 0,
		nextTooltipKey: () => tooltipUseCount++ % numGlobalTooltips,
		globalTooltipsProps: makeGlobalPopupsProps({ type: 'tooltip', num: 3 }),
		globalPopupsProps: makeGlobalPopupsProps({ type: 'popup' })
	});

	setContext('tabs', tabContext);
	const mainRightSidebar = writable<RightSidebar<SvelteComponent>>({});
	setContext('mainRightSideBar', mainRightSidebar);
</script>

<GlobalPopups />
<AppShell slotPageContent="relative">
	<svelte:fragment slot="header">
		<MainHeader tabs={$tabs} bind:tabSet={$tabSet} bind:clearTabs={$clearTabs} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<slot name="sidebarLeft" />
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		{#if $mainRightSidebar !== undefined}
			<svelte:component this={$mainRightSidebar.component} {...$mainRightSidebar.props} />
		{/if}
	</svelte:fragment>

	<svelte:fragment>
		<slot />
	</svelte:fragment>
</AppShell>
