<script lang="ts">
	import Modals from '$lib/global/Modals.svelte';
	import Notifications from '$lib/global/Notifications.svelte';
	import Popups from '$lib/global/Popups.svelte';
	import MainLayout from '$lib/layout/MainLayout.svelte';
	import { isLocaleLoading, Localization, setTheme, theme } from '$lib/global';
	import { page } from '$app/stores';
	import '../app.pcss';
	import Lightmode from '$lib/global/Lightmode.svelte';
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Geos UI</title>
</svelte:head>
<Localization />
<MainLayout>
	<svelte:fragment slot="sidebarLeft">
		{#if !$isLocaleLoading}
			<svelte:component this={$page.data.sidebarLeft} {...$page.data.sidebarLeftProps} />
		{/if}
	</svelte:fragment>
	{#if !$isLocaleLoading}
		<slot />
	{/if}
	<Modals />
</MainLayout>
<Popups />
<Notifications />
<Lightmode />
