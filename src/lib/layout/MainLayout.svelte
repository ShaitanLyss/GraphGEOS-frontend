<script lang="ts">
	import { setContext, GlobalPopups } from '$lib/global';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { MainHeader, type TabContext } from '$lib/layout';

	const tabs: TabContext['tabs'] = writable([]);
	let tabSet: TabContext['tabSet'] = writable();
	let clearTabs: TabContext['clearTabs'] = writable();

	const tabContext: TabContext = {
		tabs: tabs,
		tabSet,
		clearTabs
	};

	setContext('tabs', tabContext);
</script>

<GlobalPopups />
<AppShell slotPageContent="relative">
	<svelte:fragment slot="header">
		<MainHeader tabs={$tabs} bind:tabSet={$tabSet} bind:clearTabs={$clearTabs} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<slot name="sidebarLeft" />
	</svelte:fragment>

	<svelte:fragment>
		<slot />
	</svelte:fragment>
</AppShell>
