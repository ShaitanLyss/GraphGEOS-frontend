<script lang="ts">
	import { EditorSwitcher } from '$lib/editor';
	import type { PageData } from './$houdini';
	import { setContext } from '$lib/global';
	import { writable } from 'svelte/store';
	import type { GeosDataContext } from '$lib/geos';

	export let data: PageData;

	const xmlSchema: GeosDataContext['xmlSchema'] = writable();
	setContext('geos', {
		xmlSchema: xmlSchema
	});
	$: ({ GeosXmlSchema } = data);
	$: $xmlSchema = $GeosXmlSchema.data?.geos.xmlSchema;
</script>

<EditorSwitcher />
