<script lang="ts">
	import {
		getPublicConfig,
		isLocaleLoading,
		Localization,
		setContext,
		setTheme,
		theme,
		type resolveContext,
		getContext
	} from '$lib/global';
	import { onMount } from 'svelte';
	import type { publicConfig } from '$lib/config';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	import monacoLoader from '@monaco-editor/loader';
	import type { GeosDataContext, GeosSchema } from '$lib/geos';
	import { writable } from 'svelte/store';
	import { PendingValue } from '$houdini';
	import type { GeosTypesTree } from '$lib/backend-interaction';

	onMount(async () => {
		// preload monaco
		await monacoLoader.init();
	});

	const { xmlSchema, typesPaths, typesTree } = getContext('geos');
	const { geosSchema } = getContext('geos_v2');

	$: ({ GraphEditorData } = data);
	$: $xmlSchema = $GraphEditorData.data?.geos.xmlSchema;
	$: if ($GraphEditorData.data?.geos.typesTree !== PendingValue)
		$typesTree = $GraphEditorData.data?.geos.typesTree as GeosTypesTree;
	$: if ($GraphEditorData.data?.geos.typesPaths !== PendingValue)
		$typesPaths = $GraphEditorData.data?.geos.typesPaths;

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
</script>

<slot />
