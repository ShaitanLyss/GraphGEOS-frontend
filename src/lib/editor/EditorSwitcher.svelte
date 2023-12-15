<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications, getContext } from '$lib/global';
	import type { NodeEditor, NodeFactory } from '$rete';
	import { newUniqueId } from '$utils';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	let editors: Record<string, NodeEditor | undefined> = {};
	let container: HTMLElement;
	let activeEditor: NodeFactory | undefined;

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => activeEditor
	});

	setContext('onSave', () =>
		notifications.show({ title: 'Saved', message: 'TODO', color: 'green' })
	);

	// Setup Tabs
	const tabsContext = getContext('tabs');
	function addNewEditor() {
		const id = newUniqueId('node-editor');
		editors[id] = undefined;
		editors = editors;
		$tabsContext?.addTab({ key: id, props: { id, name: 'New Editor' } });
	}
	$: $tabsContext?.setMainAddModel({
		addModel: addNewEditor,
		tooltip: 'Add Model',
		label: 'Add Model'
	});
	let activeId: string | undefined;
	$: console.log('tabSet', $tabsContext?.tabSet);
	$: $tabsContext?.tabSet.subscribe((value) => {
		activeId = value;
	});
	$: console.log('active id', activeId);
	$: if ($tabsContext) {
		if (Object.keys(editors).length === 0) {
			addNewEditor();
		}
	}

	// Setup Cleanup
	const rightSidebar = getContext('mainRightSideBar');
	function onDestroyCleanup() {
		$tabsContext?.clearTabs();
		$rightSidebar = { component: undefined };
	}
	onDestroy(() => {
		onDestroyCleanup();
	});
</script>

<div
	bind:this={container}
	class="h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
	in:fade
	out:fade={{ duration: 200 }}
	on:outrostart={onDestroyCleanup}
>
	{#if activeId && activeId in editors}
		<EditorSharedOverlay />
	{/if}
	{#each Object.keys(editors) as key (key)}
		<Editor bind:editor={editors[key]} hidden={key !== activeId} />
	{/each}
</div>
