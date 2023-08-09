<script lang="ts">
	import type { GetGraph$result } from '$houdini';
	import type { NodeEditor } from '$rete/NodeEditor';
	import { capitalize, words } from '$utils/string';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import type { UUID } from 'crypto';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { Writable } from 'svelte/store';

	export let formElement: HTMLFormElement | undefined = undefined;
	let descrTextarea: HTMLTextAreaElement;
	export let editor: NodeEditor;
	export let userName: string;
	export let graph: GetGraph$result['graph'] | undefined;
	const formStore: Writable<Record<string, unknown>> = localStorageStore('uploadGraphForm', {});
	$: if (graph) {
		console.log(graph);
		for (const [key, value] of Object.entries(graph)) {
			if (['id', 'name', 'authorId', 'data'].includes(key)) continue;
			$formStore[key] = value;
		}
	}

	let editorSaveData = editor.toJSON();

	onMount(() => {
		// descrTextarea.select();
	});
</script>

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
	<label class="label align-middle">
		<span>{$_('form.input.make_public')}</span>
		<input
			type="checkbox"
			class="input w-6 h-6 ms-2 my-auto"
			name="is_public"
			bind:checked={$formStore.is_public}
		/>
	</label>

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
