<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { makeCodeEditor } from './CodeEditor';
	import { localStorageStore, modeCurrent } from '@skeletonlabs/skeleton';
	import { getContext } from '$lib/global';
	import type { GeosSchema } from '$lib/geos';
	import { PendingValue } from '$houdini';
	import { onDestroy } from 'svelte';

	export let width = '100%';
	export let height = '100%';

	const text = localStorageStore(
		'codeEditorText',
		'<?xml version="1.0"?>\n\n<Problem>\n  \n</Problem>'
	);
	const saveContext = getContext('save');
	$saveContext.set('codeEditor', {
		save: () => {
			codeEditorPromise.then((codeEditor) => text.set(codeEditor.getText().text));
		}
	});
	onDestroy(() => {
		$saveContext.delete('codeEditor');
	});

	const geosSchema: GeosSchema = {
		complexTypes: new Map(),
		simpleTypes: new Map()
	};
	const { xmlSchema } = getContext('geos');

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

	const res = makeCodeEditor({
		backend: 'monaco',
		geosSchema
	});
	const { codeEditorAction } = res;
	export const codeEditor = res.codeEditor;
	export const codeEditorPromise = res.codeEditorPromise;

	codeEditor.createModel({
		language: 'geos_xml',
		value: $text
	});
	codeEditorPromise;
	$: codeEditor.setLightTheme($modeCurrent);
	export let border = '';
</script>

<div
	class="{border} transition-colors overflow"
	style="width: {width}; height: {height};"
	transition:slide={{ axis: 'x', duration: 200 }}
>
	{#await codeEditorPromise}
		<div class="w-full flex justify-center p-2">Loading...</div>
	{:then}
		<div
			class="h-full w-full overflow-x-scroll"
			use:codeEditorAction
			transition:fade={{ duration: 100 }}
		/>
	{/await}
</div>
