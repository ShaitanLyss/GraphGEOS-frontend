<script lang="ts">
	import { EditorSwitcher } from '$lib/editor';
	import { setContext } from '$lib/global';
	import { writable } from 'svelte/store';
	import type { GeosDataContext } from '$lib/geos';
	import type { PageData } from './$types';

	export let data: PageData;

	const xmlSchema: GeosDataContext['xmlSchema'] = writable();
	setContext('geos', {
		xmlSchema: xmlSchema
	});
	$: ({ GeosXmlSchema } = data);
	$: $xmlSchema = $GeosXmlSchema.data?.geos.xmlSchema;
</script>

<EditorSwitcher />
