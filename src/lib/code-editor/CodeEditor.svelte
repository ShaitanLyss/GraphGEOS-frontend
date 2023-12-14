<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { makeCodeEditor } from './CodeEditor';
	import { modeCurrent } from '@skeletonlabs/skeleton';

	export let width = '100%';
	export let height = '100%';

	const { codeEditor, codeEditorAction, codeEditorPromise } = makeCodeEditor({ backend: 'monaco' });
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
</script>

<div
	class="border-s-2 border-surface-100-800-token transition-colors"
	style="width: {width}; height: {height};"
	transition:slide={{ axis: 'x', duration: 200 }}
>
	{#await codeEditorPromise}
		<div class="w-full flex justify-center p-2">Loading...</div>
	{/await}
	<div class="h-full w-full" use:codeEditorAction />
</div>
