<script lang="ts">
	import Modals from '$lib/global/Modals.svelte';
	import Notifications from '$lib/global/Notifications.svelte';
	import Popups from '$lib/global/Popups.svelte';
	import MainLayout from '$lib/layout/MainLayout.svelte';
	import {
		getPublicConfig,
		isLocaleLoading,
		Localization,
		setContext,
		setTheme,
		theme
	} from '$lib/global';
	import { page } from '$app/stores';
	import '../app.pcss';
	import Lightmode from '$lib/global/Lightmode.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import type { publicConfig } from '$lib/config';
	export let data: LayoutData & { publicConfig: typeof publicConfig };
	import monacoLoader from '@monaco-editor/loader';
	import { initializeStores } from '@skeletonlabs/skeleton';

	onMount(async () => {
		// preload monaco
		await monacoLoader.init();
	});
	initializeStores();
	setContext('publicConfig', data.publicConfig);
</script>

<svelte:head>
	<title>{data.publicConfig.title}</title>
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
</MainLayout>
<Modals />
<Popups />
<Notifications />
<Lightmode />
