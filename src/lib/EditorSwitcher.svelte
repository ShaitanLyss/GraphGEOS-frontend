<script lang="ts">
	import {
		TabGroup,
		Tab,
		LightSwitch,
		ModalSettings,
		modalStore,
		AppShell
	} from '@skeletonlabs/skeleton';
	// import { type DragOptions, draggable } from '@neodrag/svelte';
	import { localStorageStore } from '@skeletonlabs/skeleton';

	import type { Writable } from 'svelte/store';
	import Editor from '$lib/editor/Editor.svelte';
	import { onMount, setContext } from 'svelte';

	import type { EditorView } from './editor/types';
	import { _ } from 'svelte-i18n';
	import LocaleSwitcher from './LocaleSwitcher.svelte';
	import NodeBrowser from './editor/node-browser/NodeBrowser.svelte';
	import { addContextFunction } from './utils';
	import type { NodeEditor, NodeEditorSaveData } from '$rete/NodeEditor';
	import Fa from 'svelte-fa';
	import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
	import { faUser } from '@fortawesome/free-regular-svg-icons';
	import { v1 as uuidv1 } from 'uuid';
	import { EditMacroNodeChannel } from './broadcast-channels';
	let addButonClicked = -1;

	const editMacroNodeChannel = new EditMacroNodeChannel();

	export let examples: EditorView[] = [];
	let editorsViews: EditorView[] = [];
	const tabSet: Writable<string> = localStorageStore('tabSet', 'XML');
	const savedEditors: Writable<Record<string, NodeEditorSaveData>> = localStorageStore(
		'saveData',
		{}
	);
	let ready = false;

	// Copy names of editors in tabs
	let tabNames: string[] = [];

	onMount(async () => {
		await import('$rete/setup/appLaunch');
		for (const [key, editorSaveData] of Object.entries($savedEditors)) {
			editorsViews = [
				...editorsViews,
				{
					key: key,
					label: editorSaveData.editorName,
					saveData: editorSaveData
				}
			];
		}
		if (editorsViews.length === 0) editorsViews = examples;

		for (const editorTab of editorsViews) {
			tabNames.push(editorTab.label);
			ready = true;
		}
	});

	// Adds a new editor
	function addEditor(saveData?: NodeEditorSaveData) {
		const key = uuidv1();
		console.log('addEditor', key);
		console.log(saveData ? saveData.editorName : $_('new.editor'));
		editorsViews = [
			...editorsViews,
			{ key: key, label: saveData ? saveData.editorName : $_('new.editor'), saveData }
		];
		tabNames[editorsViews.length - 1] = saveData ? saveData.editorName : $_('new.editor');
		$tabSet = key;
		setTimeout(() => {
			addButonClicked = -1;
		}, 0);
	}

	function deleteEditor({ key }: { key: string }) {
		const index = editorsViews.findIndex((editor) => editor.key === key);
		console.log('deleteEditor', key, index);
		
		tabNames.splice(index, 1);
		tabNames = tabNames;
		delete editors[key];
		editors =editors;
		editorComponents.splice(index, 1);
		editorsViews.splice(index, 1);
		editorsViews = editorsViews;
		$savedEditors = $savedEditors;

		if (editorsViews.length > 0 && editorsViews.length === index) {
			$tabSet = editorsViews[index - 1].key;
		} else if (editorsViews.length > 0) {
			$tabSet = editorsViews[index].key;
		} else {
			console.log("No more editors left")
		}

	}

	// const draggableTabOptions: DragOptions = {
	// 	// axis: 'x',
	// 	// bounds: 'parent',
	// 	onDragEnd({}) {

	// 	}
	// };
	let editorComponents: Editor[] = [];
	let editors: Record<string, NodeEditor> = {};

	function openChangeTabNameModal(tabIndex: number) {
		const changeTabName: ModalSettings = {
			type: 'prompt',
			// Data
			title: $_('enter.name'),
			body: $_('prompt.provide.name.graph'),
			// Populates the input value and attributes
			value: tabNames[tabIndex],
			valueAttr: { type: 'text', required: true },
			buttonTextCancel: $_('button.cancel'),
			buttonTextSubmit: $_('button.confirm'),

			// Returns the updated response value
			response: (r: string) => {
				if (r) tabNames[tabIndex] = r;
				// editorComponents[tabIndex]$
			}
		};
		modalStore.trigger(changeTabName);
	}

	function saveEditors() {
		for (let i = 0; i < editorsViews.length; i++) {
			const editor = editors[editorsViews[i].key];
			console.log(editor.name);
			$savedEditors[editorsViews[i].key] = editor.toJSON();
			console.log($savedEditors);
		}
	}
	addContextFunction('onSave', saveEditors);

	editMacroNodeChannel.onmessage = async (data) => {
		console.log('editMacroNodeChannel.onmessage', data);
		addEditor(data.graph);
	};
</script>

{#if ready}
	<AppShell slotPageContent="relative">
		<svelte:fragment slot="header">
			<div class="flex">
				<TabGroup>
					{#each editorsViews as editor, index (index)}
						<div
							role="button"
							class="relative group"
							tabindex={index}
							on:dblclick={() => openChangeTabNameModal(index)}
						>
							<!-- use:draggable={draggableTabOptions}
						> -->
							<button
								type="button"
								class="absolute top-0.5 right-0.5 p-1 hidden group-hover:block rounded-token variant-soft-surface"
								on:click={() => {
									deleteEditor({ key: editor.key });
								}}
							>
								<Fa icon={faTimes} size="xs" />
							</button>
							<Tab bind:group={$tabSet} name="tab{index}" value={editor.key}>{tabNames[index]}</Tab>
						</div>
					{/each}
					<Tab
						on:click={() => addEditor()}
						bind:group={addButonClicked}
						name="addEditorBtn"
						value={undefined}>+</Tab
					>
				</TabGroup>
				<div class="group ml-auto pe-4 relative h-auto">
					<div class="h-full overflow-hidden">
						<div
							class="opacity-0 transition-all group-hover:opacity-100 flex h-full
						space-x-3 items-center justify-end text-surface-900-50-token
						overflow-hidden translate-x-20 group-hover:translate-x-0 ps-6
						"
						>
							<a href="/auth" class="p-1" on:click={saveEditors}>
								<Fa icon={faUser} size="sm" class="opacity-80" />
							</a>
							<LocaleSwitcher />
							<LightSwitch />
						</div>
						<div
							class="absolute inset-0 transition-opacity group-hover:opacity-0 opacity-50 pe-4 flex justify-end items-center pointer-events-none"
						>
							<Fa icon={faEllipsisH} size="2x" />
						</div>
					</div>
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="sidebarLeft">
			<NodeBrowser />
		</svelte:fragment>

		<svelte:fragment>
			{#each editorsViews as editorView, index (editorView)}				
				<Editor
					bind:editor={editors[editorView.key]}
					bind:this={editorComponents[index]}
					saveData={editorView.saveData}
					hidden={$tabSet !== editorView.key}
					loadExample={editorView.example}
					name={tabNames[index]}
					onNameChange={(name) => (tabNames[index] = name)}
				/>
			{/each}
		</svelte:fragment>
	</AppShell>
{:else}
	<div class="h-full">
		<div class="flex justify-left space-x-4 p-4">
			<div class="placeholder w-12" />
			<div class="placeholder w-20" />
			<div class="placeholder w-20" />
			<div class="placeholder w-24" />
		</div>
		<section class="card w-full" style="height: 75%;">
			<div class="card-header flex justify-between items-center">
				<div class="flex justify-center items-center space-x-4" class:animate-pulse={true}>
					<div class="placeholder-circle w-16" />
					<div class="placeholder-circle w-14" />
					<div class="placeholder-circle w-10" />
				</div>
			</div>
			<div class="p-4 space-y-4 h-full" class:animate-pulse={true}>
				<div class="placeholder" />
				<div class="grid grid-cols-4 gap-4">
					<div class="placeholder" />
					<div class="placeholder" />
					<div class="placeholder" />
					<div class="placeholder" />
				</div>
				<div class="placeholder" />
				<div class="placeholder" />
			</div>
		</section>
	</div>
{/if}
