<script lang="ts">
	import Modals from '$lib/global/Modals.svelte';
	import Notifications from '$lib/global/Notifications.svelte';
	import Popups from '$lib/global/Popups.svelte';
	import MainView from '$lib/layout/MainView.svelte';
	import { isLocaleLoading, Localization } from '$lib/global';
	import { page } from '$app/stores';
	import '../app.pcss';
	import Lightmode from '$lib/global/Lightmode.svelte';
</script>

<svelte:head>
	<title>Geos UI</title>
</svelte:head>
<Localization />
<MainView>
	<svelte:fragment slot="sidebarLeft">
		{#if !$isLocaleLoading}
			<svelte:component this={$page.data.sidebarLeft} {...$page.data.sidebarLeftProps} />
		{/if}
	</svelte:fragment>
	{#if !$isLocaleLoading}
		<slot />
	{/if}
	<svelte:fragment slot="tabs">
		<svelte:component this={$page.data.tabs} />
	</svelte:fragment>
	<Modals />
</MainView>
<Popups />
<Notifications />
<Lightmode />
