<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { makeCodeEditor } from './CodeEditor';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { getContext } from '$lib/global';
	import type { GeosSchema } from '$lib/geos';
	import { PendingValue } from '$houdini';

	export let width = '100%';
	export let height = '100%';
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

	const { codeEditor, codeEditorAction, codeEditorPromise } = makeCodeEditor({
		backend: 'monaco',
		geosSchema
	});
	codeEditor.createModel({
		language: 'geos_xml',
		value: `
        <?xml version="1.0"?>

<Problem>
  <Solvers>
    <!-- define the solver
    we'll have to discuss the cflFactor with Randy
    define the source coordinates
    define the time source frequency
    define the receiver coordinates -->
    <AcousticSEM
      name="acousticSolver"
      cflFactor="0.25"
      discretization="FE1"
      targetRegions="{ Region }"
      sourceCoordinates="{ { 1005.0, 1005.0, 1005.0 } }"
      timeSourceFrequency="2.0"
      receiverCoordinates="{ { 1105,1005, 1005 } }"
      outputSeismoTrace="0"
      dtSeismoTrace="0.005" />

  </Solvers>

  <Mesh>
    <VTKMesh
      name="mesh"
      fieldsToImport="{ mediumVelocity }"
      fieldNamesInGEOSX="{ mediumVelocity }"
      file="../models/bicouche50x50x50.vtu" />
  </Mesh>

  <Geometry>
    <Box
      name="zpos"
      xMin="{-0.01, -0.01, 499.99}"
      xMax="{500.01, 500.01, 500.01}" />
  </Geometry>
</Problem>
        `.trim()
	});
	codeEditorPromise;
	$: codeEditor.setLightTheme($modeCurrent);
	export let border = '';
</script>

<div
	class="{border} transition-colors"
	style="width: {width}; height: {height};"
	transition:slide={{ axis: 'x', duration: 200 }}
>
	{#await codeEditorPromise}
		<div class="w-full flex justify-center p-2">Loading...</div>
	{:then}
		<div class="h-full w-full" use:codeEditorAction transition:fade={{ duration: 50 }} />
	{/await}
</div>
