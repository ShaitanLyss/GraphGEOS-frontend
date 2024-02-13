<script lang="ts">
	import Modals from '$lib/global/Modals.svelte';
	import Notifications from '$lib/global/Notifications.svelte';
	import Popups from '$lib/global/Popups.svelte';
	import MainLayout from '$lib/layout/MainLayout.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import '../app.pcss';
	import Lightmode from '$lib/global/Lightmode.svelte';
	import { isLocaleLoading, Localization, setContext, type resolveContext } from '$lib/global';
	import type { LayoutData, LayoutServerData } from './$types';
	export let data: LayoutServerData;

	import type { GeosDataContext, GeosSchema } from '$lib/geos';
	import { writable } from 'svelte/store';

	initializeStores();
	setContext('publicConfig', data.publicConfig);
	setContext('session', data.session);
	const xmlSchema: GeosDataContext['xmlSchema'] = writable();
	const typesTree: GeosDataContext['typesTree'] = writable();
	const typesPaths: GeosDataContext['typesPaths'] = writable();
	setContext('geos', {
		typesPaths,
		xmlSchema,
		typesTree
	});
	const geosSchema: GeosSchema = {
		complexTypes: new Map(),
		simpleTypes: new Map()
	};
	const newGeosContext: resolveContext<'geos_v2'> = { geosSchema };
	setContext('geos_v2', newGeosContext);
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
	<svelte:fragment slot="footer">
		<svelte:component this={$page.data.footer} {...$page.data.footerProps} />
	</svelte:fragment>
</MainLayout>
<Modals />
<Popups />
<Notifications />
<Lightmode />
