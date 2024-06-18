<script lang="ts">
	import { GetTagsStore, type GetGraph$result, type GraphFromAuthorAndName$result } from '$houdini';
	import type { NodeEditor } from '$rete/NodeEditor';
	import { capitalize, words } from '$utils/string';
	import {
		localStorageStore,
		type AutocompleteOption,
		Autocomplete,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import type { UUID } from 'crypto';
	import { onMount, tick } from 'svelte';
	import { _, notifications } from '$lib/global';
	import type { Writable } from 'svelte/store';
	import AddNodeContextMenu from '$lib/menu/addNode/AddNodeContextMenu.svelte';
	import { flip } from 'svelte/animate';
	import type { GraphFormData } from '$lib/modals/types';
	import { newLocalId } from '$utils';
	import { browser } from '$app/environment';
	import Fa from 'svelte-fa';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';

	const localId = newLocalId();
	export let formElement: HTMLFormElement | undefined = undefined;
	let descrTextarea: HTMLTextAreaElement;
	export let editor: NodeEditor;
	export let userName: string;
	export let graph:
		| GraphFromAuthorAndName$result['graph']['graphWithAuthordAndNameExists']['graph']
		| undefined;

	const currentStoreVersion = 2;
	const formStoreVersion = localStorageStore<number>('uploadGraphFormVersion', currentStoreVersion);

	$: if ($formStoreVersion !== currentStoreVersion) {
		console.log('Upgrading form store version');
		localStorage.removeItem('uploadGraphForm');
		$formStoreVersion = currentStoreVersion;
	}
	const formStore = localStorageStore<GraphFormData>('uploadGraphForm', {
		tags: [],
		description: '',
		is_public: true,
		favorite: false
	});

	$: if (graph) {
		console.log(graph);
		for (const [key, value] of Object.entries(graph)) {
			if (['id', 'name', 'authorId', 'data'].includes(key)) continue;
			$formStore[key] = value;
		}
		if (!Array.isArray(graph.tags)) $formStore.tags = [];
	}

	const tagsStore = new GetTagsStore();
	$: browser && tagsStore.fetch();

	let tags: AutocompleteOption<string>[] = [];

	$: if ($tagsStore.data) {
		tags = $tagsStore.data.tags
			.filter((tag) => $formStore.tags == null || !$formStore.tags.includes(tag.tag))
			.sort((a, b) => b.timesAdded - a.timesAdded)
			.map((tag) => ({ value: tag.tag, label: tag.tag }));
	}

	function onAutocompleteTagSelection(e: CustomEvent<AutocompleteOption<string>>): void {
		addTag(e.detail.label);

		// setTimeout(() => {
		// 	tagInput.focus({});
		// 	tagInput.dispatchEvent(new Event("focus", {bubbles: false, cancelable: true}))
		// }, 0);
	}

	function addTag(tag: string) {
		if ($formStore.tags.includes(tag)) {
			notifications.show({
				message: $_('form.input.graph.tags.already_added'),
				color: 'yellow'
			});
			return;
		}
		$formStore.tags = [...$formStore.tags, tag];
	}

	function removeTag(tag: string) {
		$formStore.tags = $formStore.tags.filter((t) => t !== tag);
	}

	// const tags = $tagsStore.
	// const isPublicDefault = localStorageStore("graph-edit-is-public-default", true);

	let editorSaveData = editor.toJSON();
	onMount(() => {
		// descrTextarea.select();
	});

	const popupTagAutocomplete: PopupSettings = {
		event: 'focus-click',
		target: 'popupTagAutocomplete',
		placement: 'bottom'
	};

	let tagInputValue: string = '';
	let tagInput: HTMLInputElement;

	function commitTagInput() {
		const value = tagInputValue.trim();
		tagInputValue = '';
		if (value === '') return;
		addTag(value);
		setTimeout(() => {
			tagInput.focus({});
		}, 0);
	}
</script>

<div
	class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto z-10"
	tabindex="-1"
	data-popup="popupTagAutocomplete"
>
	<Autocomplete
		bind:input={tagInputValue}
		options={tags}
		emptyState={tagInputValue.trim() !== ''
			? $_('form.input.graph.tags.empty_state', { values: { tag: `'${tagInputValue}'` } })
			: ''}
		on:selection={onAutocompleteTagSelection}
	/>
</div>

<form
	class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
	bind:this={formElement}
>
	<label class="label">
		<span>{capitalize($_('form.input.graph.name.title'))}</span>
		<!-- <span class="text-red-500 ms-1">*</span>-->
		<input
			type="text"
			class="input"
			name="name"
			placeholder={words($_('form.input.graph.name_placeholder'))}
			required
			readonly
			value={editor.name}
		/>
	</label>
	<!-- Description -->
	<label class="label">
		<span>{$_('title.description')}</span>
		<textarea
			bind:this={descrTextarea}
			class="textarea"
			rows="3"
			name="description"
			placeholder={$_('form.input.graph.description_placeholder')}
			bind:value={$formStore.description}
		/>
	</label>
	<!-- Tags -->
	<div class="label flex flex-col">
		<span>{capitalize($_('form.input.graph.tags.title'))}</span>
		<input type="hidden" name="tags" value={$formStore.tags} />
		{#if $formStore.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each $formStore['tags'] as tag (tag)}
					<button
						type="button"
						animate:flip={{ duration: 100 }}
						class="badge variant-filled card-hover flex gap-1 items-baseline"
						value={tag}
						on:contextmenu={(e) => removeTag(e.currentTarget.value ?? '')}
						on:click={(e) => removeTag(e.currentTarget.value ?? '')}
						>{tag} <Fa icon={faXmark} size="xs" /></button
					>
				{/each}
			</div>
		{/if}
		<div class="input-group grid-cols-[1fr_auto]">
			<input
				type="text"
				bind:this={tagInput}
				bind:value={tagInputValue}
				use:popup={popupTagAutocomplete}
				on:keypress={(e) => {
					if (e.key !== 'Enter') return;
					commitTagInput();
				}}
				placeholder={$_('form.input.graph.tags_placeholder')}
			/>
			<button type="button" class="variant-filled-secondary" on:click={() => commitTagInput()}
				>{$_('button.add')}</button
			>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-2">
		<label for="public" class="select-none cursor-pointer">
			{$_('form.input.make_public')}
		</label>
		<input
			id="public"
			type="checkbox"
			class="input w-6 h-6 ms-2 my-auto cursor-pointer"
			name="is_public"
			bind:checked={$formStore.is_public}
		/>
		<label for="favorite" class="select-none cursor-pointer">{$_('form.input.add_favorite')}</label>
		<input
			id="favorite"
			type="checkbox"
			class="input w-6 h-6 ms-2 my-auto cursor-pointer"
			name="favorite"
			bind:checked={$formStore.favorite}
		/>
	</div>
	<!-- <label class="label align-middle"> -->

	<!-- Author -->
	<label class="label">
		<span>{$_('title.author')}</span>
		<!-- <span class="text-red-500 ms-1"> *</span> -->
		<input
			type="text"
			class="input"
			name="author"
			placeholder="Author"
			required
			readonly
			value={userName}
		/>
	</label>
	<input type="hidden" name="data" value={JSON.stringify(editorSaveData)} />
</form>
