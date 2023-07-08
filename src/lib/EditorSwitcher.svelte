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
	import { onMount } from 'svelte';

	import type { EditorView } from './editor/types';
	import { _ } from 'svelte-i18n';
	import LocaleSwitcher from './LocaleSwitcher.svelte';
	import NodeBrowser from './editor/node-browser/NodeBrowser.svelte';

	let addButonClicked = -1;

	export let examples: EditorView[] = [];

	let editors: EditorView[] = examples;

	const tabSet: Writable<string> = localStorageStore('exampleTabSet', 'math');
	let ready = false;

	onMount(() => {
		ready = true;
	});

	function addEditor() {
		console.log('addEditor');
		const key = `newEditor${editors.length}`;
		editors = [...editors, { key: key, label: $_('new.editor') }];
		tabNames[editors.length - 1] = $_('new.editor');
		$tabSet = key;
		setTimeout(() => {
			addButonClicked = -1;
		}, 0);
	}
	const tabNames: string[] = [];
	for (const editorTab of editors) {
		tabNames.push(editorTab.label);
	}

	// const draggableTabOptions: DragOptions = {
	// 	// axis: 'x',
	// 	// bounds: 'parent',
	// 	onDragEnd({}) {

	// 	}
	// };

	let editorComponents: Editor[] = [];

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
</script>

{#if ready}
	<AppShell>
		<svelte:fragment slot="header">
			<div class="flex">
				<TabGroup>
					{#each editors as editor, index (index)}
						<div role="button" tabindex="{index}" on:dblclick={() => openChangeTabNameModal(index)}>
							<!-- use:draggable={draggableTabOptions}
						> -->
							<Tab bind:group={$tabSet} name="tab{index}" value={editor.key}>{tabNames[index]}</Tab>
						</div>
					{/each}
					<Tab
						on:click={addEditor}
						bind:group={addButonClicked}
						name="addEditorBtn"
						value={undefined}>+</Tab
					>
				</TabGroup>
				<div class="ml-auto pe-4 pe- my-auto flex h-full space-x-3 items-center justify-end">
					<LocaleSwitcher />
					<LightSwitch />
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="sidebarLeft">
			<NodeBrowser />
		</svelte:fragment>

		<svelte:fragment>
			{#each editors as editor, index (index)}
				<Editor
					bind:this={editorComponents[index]}
					hidden={$tabSet !== editor.key}
					loadExample={editor.example}
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
