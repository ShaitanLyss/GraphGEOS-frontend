<script lang="ts">
	import { browser } from '$app/environment';
	import CodeEditor from '$lib/code-editor/CodeEditor.svelte';
	import type { GeosDataContext } from '$lib/geos';
	import { writable } from 'svelte/store';

	import { setContext } from '$lib/global';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);

	// const xmlSchema: GeosDataContext['xmlSchema'] = writable();
	// setContext('geos', {
	// 	xmlSchema: xmlSchema
	// });
	// $: ({ CodeEditorData } = data);

	// $: $xmlSchema = $CodeEditorData.data?.geos.xmlSchema;
</script>

{#if browser}
	<CodeEditor width="100%" height="100%" />
{/if}
