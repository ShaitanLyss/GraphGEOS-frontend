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
		theme,
		type resolveContext
	} from '$lib/global';
	import { page } from '$app/stores';
	import '../app.pcss';
	import Lightmode from '$lib/global/Lightmode.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import type { publicConfig } from '$lib/config';
	export let data: LayoutData;
	import monacoLoader from '@monaco-editor/loader';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { GeosDataContext, GeosSchema } from '$lib/geos';
	import { writable } from 'svelte/store';
	import { PendingValue } from '$houdini';
	import type { GeosTypesTree } from '$lib/backend-interaction';

	onMount(async () => {
		// preload monaco
		await monacoLoader.init();
	});
	initializeStores();
	setContext('publicConfig', data.publicConfig);

	const xmlSchema: GeosDataContext['xmlSchema'] = writable();
	const typesTree: GeosDataContext['typesTree'] = writable();
	const typesPaths: GeosDataContext['typesPaths'] = writable();
	setContext('geos', {
		typesPaths,
		xmlSchema,
		typesTree
	});
	$: ({ GraphEditorData } = data);
	$: $xmlSchema = $GraphEditorData.data?.geos.xmlSchema;
	$: if ($GraphEditorData.data?.geos.typesTree !== PendingValue)
		$typesTree = $GraphEditorData.data?.geos.typesTree as GeosTypesTree;
	$: if ($GraphEditorData.data?.geos.typesPaths !== PendingValue)
		$typesPaths = $GraphEditorData.data?.geos.typesPaths;

	const geosSchema: GeosSchema = {
		complexTypes: new Map(),
		simpleTypes: new Map()
	};

	$: if ($xmlSchema) {
		$xmlSchema.complexTypes.forEach((value) => {
			if (value === PendingValue) return;
			let { name, attributes, childTypes, link } = value;
			name = name.replace(/Type$/, '');
			childTypes = childTypes.map((child) => child.replace(/Type$/, '')).sort();
			geosSchema.complexTypes.set(name, {
				childTypes,
				name,
				link,
				attributes: attributes.reduce((map, attr) => {
					map.set(attr.name, attr);
					return map;
				}, new Map())
			});
		});
	}
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
</MainLayout>
<Modals />
<Popups />
<Notifications />
<Lightmode />
