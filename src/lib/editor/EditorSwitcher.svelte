<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications, getContext, _ } from '$lib/global';
	import type { NodeEditor, NodeFactory } from '$rete';
	import { newUniqueId } from '$utils';
	import { modeCurrent, type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	let editors: Record<string, NodeFactory | undefined> = {};
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
	const modalStore = getModalStore();
	function openChangeTabNameModal(key: string) {
		if (editors[key] === undefined) return;
		const changeTabName: ModalSettings = {
			type: 'prompt',
			// Data
			title: $_('enter.name'),
			body: $_('prompt.provide.name.graph'),
			// Populates the input value and attributes
			value: editors[key]?.getEditor().name,
			valueAttr: { type: 'text', required: true },
			buttonTextCancel: $_('button.cancel'),
			buttonTextSubmit: $_('button.confirm'),

			// Returns the updated response value
			response: (r: string) => {
				if (r) {
					editors[key]?.getEditor().setName(r);
					$tabsContext?.renameTab(key, r);
				}
			}
		};
		modalStore.trigger(changeTabName);
	}

	function addNewEditor() {
		const id = newUniqueId('node-editor');
		editors[id] = undefined;
		editors = editors;
		$tabsContext?.addTab({
			key: id,
			props: {
				id,
				name: $_('editor.default-name'),
				onClose: () => {
					delete editors[id];
					editors = editors;
				},
				onDblClick: () => {
					console.log('onDblClick');
					openChangeTabNameModal(id);
				}
			}
		});
	}
	$: $tabsContext?.setMainAddModel({
		addModel: addNewEditor,
		tooltip: 'Add Model',
		label: 'Add Model'
	});
	let activeId: string | undefined;
	$: $tabsContext?.tabSet.subscribe((value) => {
		activeId = value;

		activeEditor = value ? editors[value] : undefined;
	});
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
	{#each Object.entries(editors) as [key] (key)}
		<Editor
			bind:factory={editors[key]}
			id={key}
			name={$_('editor.default-name')}
			hidden={key !== activeId}
		/>
	{/each}
</div>
