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
{#if !$isLocaleLoading}
	<MainView>
		<svelte:fragment slot="sidebarLeft">
			<svelte:component this={$page.data.sidebarLeft} {...$page.data.sidebarLeftProps} />
		</svelte:fragment>
		<slot />
		<svelte:fragment slot="tabs">
			<svelte:component this={$page.data.tabs} />
		</svelte:fragment>
	</MainView>
	<Modals />
{/if}
<Popups />
<Notifications />
<Lightmode />
