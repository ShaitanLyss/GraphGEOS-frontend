<script lang="ts">
	import { isBrowser } from '$houdini';
	import { EditMacroNodeChannel } from '$lib/broadcast-channels';
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications, getContext, _, ErrorWNotif } from '$lib/global';
	import type { NodeEditorSaveData, NodeFactory } from '$rete';
	import { isNodeEditorSaveData } from '$rete/utils';

	import { addContextFunction, newUniqueId } from '$utils';
	import {
		modeCurrent,
		type ModalSettings,
		getModalStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const id = newUniqueId('editor-switcher');
	let editors: Record<string, NodeFactory | undefined> = {};
	let container: HTMLElement;
	const savedEditors: Writable<NodeEditorSaveData[]> = localStorageStore('saveData', []);
	let firstLoading = true;
	let savesToLoad: (NodeEditorSaveData | undefined)[] = [];
	$: if (firstLoading && $savedEditors) {
		savesToLoad = $savedEditors;
		firstLoading = false;
	}

	const activeSaveEditorsId: Writable<number | null> = localStorageStore(
		'activeSaveEditorsId',
		null
	);
	function saveEditors() {
		const toSave: NodeEditorSaveData[] = [];
		let toSaveActiveId: null | number = null;
		const keys = $tabsContext?.getTabKeys();
		if (!keys) throw new ErrorWNotif({ emessage: 'No tabs found', title: 'Save' });
		for (const [i, key] of keys.entries()) {
			if (key === activeId) toSaveActiveId = i;
			const factory = editors[key];
			if (!factory) throw new ErrorWNotif({ emessage: 'An error occured', title: 'Save' });

			const editor = factory.getEditor();
			console.log(`Saving ${editor.name}...`);
			toSave.push(editor.toJSON());
		}
		$savedEditors = toSave;
		$activeSaveEditorsId = toSaveActiveId;
	}

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => {
			if (!activeId) return undefined;
			const factory = editors[activeId];
			if (isNodeEditorSaveData(factory)) return undefined;
			return factory;
		}
	});
	const saveContext = getContext('save');

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
	let mounted = false;
	onMount(() => {
		for (const [i, savedEditor] of $savedEditors.entries()) {
			const id = addNewEditor(savedEditor);
			if (i === $activeSaveEditorsId) {
				console.log('selecting saved editor ', i);
				$tabsContext?.tabSet.set(id);
				activeId = id;
			}
		}
		setTimeout(() => {
			$saveContext.set(id, {
				save: saveEditors
			});
			$saveContext = $saveContext;
		}, 500);

		mounted = true;
	});

	/**
	 * Returns id of new editor
	 * @param savedData
	 */
	function addNewEditor(savedData?: NodeEditorSaveData): string {
		const id = newUniqueId('node-editor');
		editors[id] = undefined;
		editors = editors;
		$tabsContext?.addTab({
			key: id,
			props: {
				select: savedData === undefined,
				id,
				name: savedData?.editorName ?? $_('editor.default-name'),
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
		return id;
	}
	$: $tabsContext?.setMainAddModel({
		addModel: addNewEditor,
		tooltip: 'Add Model',
		label: 'Add Model'
	});
	let activeId: string | undefined;
	$: $tabsContext?.tabSet.subscribe((value) => {
		activeId = value;
	});
	$: if (mounted && $tabsContext) {
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
		$saveContext.delete(id);
	});

	const editMacroNodeChannel = new EditMacroNodeChannel();
	editMacroNodeChannel.onmessage = async (data) => {
		console.log('editMacroNodeChannel.onmessage', data);
		addNewEditor(data.graph);
	};
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
	{#each Object.entries(editors) as [key], i (key)}
		<Editor
			bind:saveData={savesToLoad[i]}
			bind:factory={editors[key]}
			id={key}
			name={savesToLoad[i]?.editorName ?? $_('editor.default-name')}
			hidden={key !== activeId}
		/>
	{/each}
</div>
