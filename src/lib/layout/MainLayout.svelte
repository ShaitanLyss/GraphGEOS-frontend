<script lang="ts">
	import {
		setContext,
		GlobalPopups,
		type RightSidebar,
		makeGlobalPopupContext,
		makeGlobalPopupsProps
	} from '$lib/global';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { MainHeader, type TabContext } from '$lib/layout';
	import type { SvelteComponent } from 'svelte';

	const numGlobalTooltips = 3;
	let tooltipUseCount = 0;
	const numGlobalPopups = 3;
	let globalPopupUseCount = 0;
	setContext('globalPopups', {
		nextPopupKey: () => globalPopupUseCount++ % numGlobalPopups,
		nextTooltipKey: () => tooltipUseCount++ % numGlobalTooltips,
		globalTooltipsProps: makeGlobalPopupsProps({ type: 'tooltip', num: numGlobalTooltips }),
		globalPopupsProps: makeGlobalPopupsProps({ type: 'popup', num: numGlobalPopups })
	});

	// Tabs
	let tabsContext: Writable<TabContext> = writable();
	setContext('tabs', tabsContext);

	// Right Sidebar
	const mainRightSidebar = writable<RightSidebar<SvelteComponent>>({});
	setContext('mainRightSideBar', mainRightSidebar);
</script>

<GlobalPopups />
<AppShell slotPageContent="relative">
	<svelte:fragment slot="header">
		<MainHeader bind:tabsContext={$tabsContext} />
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
