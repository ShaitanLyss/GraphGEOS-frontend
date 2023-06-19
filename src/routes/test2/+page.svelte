<script lang="ts">
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import '$rete/imports';
	import { sumExample } from '$rete/example/math';
	import { timeloopExample } from '$rete/example/timeloop';
	import { forEachExample } from '$rete/example/for_each';
	import { acquisitionModelingExample } from '$rete/example/acquisition-modeling';
	import GraphSearchPanel from '$lib/editor/node-browser/GraphSearchPanel.svelte';
	import GraphItem from '$lib/editor/node-browser/GraphItem.svelte';
	import Fa from 'svelte-fa';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { _ } from 'svelte-i18n';
	import Editor from '$lib/editor/Editor.svelte';
	import { onMount } from 'svelte';
	import { setupEditor } from '$rete/editor';
	import type { NodeEditor } from '$rete/NodeEditor';

	let tab = 0;
	let editorContainer: HTMLDivElement;

	onMount(() => {
		setupEditor(editorContainer, forEachExample)
	});
</script>

<div class="flex flex-col h-screen">
  <div class="bg-gray-200 h-10 w-full">
    <!-- Top bar content goes here -->
  </div>
  <div class="flex-1 overflow-auto">
    <div class="flex h-full">
      <div class="flex-1 border border-gray-300 p-4 overflow-auto">
        <!-- First section content goes here -->
        <GraphSearchPanel />
      </div>
      <div class="flex-1 border border-gray-300 overflow-auto">
        <div class="h-full" bind:this={editorContainer}></div>
      </div>
    </div>
  </div>
</div>