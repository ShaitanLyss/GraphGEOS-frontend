<script lang="ts">
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch, Tab, TabGroup, localStorageStore } from '@skeletonlabs/skeleton';
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
	import type { EditorView } from '$lib/editor/types';
	import LocaleSwitcher from '$lib/LocaleSwitcher.svelte';
	import type { Writable } from 'svelte/store';

	let tab = 0;
	let editorContainer: HTMLDivElement;

	onMount(() => {
		setupEditor(editorContainer, forEachExample);
	});

	let editors: EditorView[] = [{ key: 'math', example: sumExample, label: 'Math' }];
	const tabSet: Writable<string> = localStorageStore('exampleTabSet', 'math');
	let tabNames = ['Math'];
	let addButonClicked = -1;
	let editorComponents = [];
</script>

<TabGroup>
	{#each editors as editor, index (index)}
		<div>
			<Tab bind:group={$tabSet} name="tab{index}" value={editor.key}>{tabNames[index]}</Tab>
		</div>
	{/each}
	<Tab bind:group={addButonClicked} name="addEditorBtn" value={undefined}>+</Tab>

	<div class="ml-auto pe-4 my-auto flex h-full space-x-3 items-center justify-end">
		<LocaleSwitcher />
		<LightSwitch />
	</div>
</TabGroup>
<AppShell>
	<!-- <svelte:fragment slot="sidebarLeft">
		<GraphSearchPanel />
	</svelte:fragment> -->
	
		<!-- <div class="h-full" bind:this={editorContainer} /> -->
		{#each editors as editor, index (index)}
			<Editor
				bind:this={editorComponents[index]}
				hidden={$tabSet !== editor.key}
				loadExample={editor.example}
				name={tabNames[index]}
				onNameChange={(name) => (tabNames[index] = name)}
			/>
		{/each}
	
</AppShell>
<!-- <div class="flex flex-col h-screen">
  <div class="bg-gray-200 h-10 w-full">
    Top bar content goes here
  </div>
  <div class="flex-1 overflow-auto">
    <div class="flex h-full">
      <div class="flex-1 border border-gray-300 p-4 overflow-auto">
        First section content goes here
        
      </div>
      <div class="flex-1 border border-gray-300 overflow-auto">
        
      </div>
    </div>
  </div>
</div> -->
