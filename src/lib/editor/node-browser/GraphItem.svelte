<script lang="ts">
	import { EditMacroNodeChannel } from '$lib/broadcast-channels';
	import type { NodeEditorSaveData } from '$rete/NodeEditor';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { _ } from 'svelte-i18n';
	import { draggable } from '@neodrag/svelte';
	import type { DragData } from '../types';
	export let graphName: string | undefined = undefined;
	export let authorName: string | null | undefined = undefined;
	export let graphId: string;
	const editMacroNodeChannel = new EditMacroNodeChannel();

	async function ondblclick(event: MouseEvent) {
		event.stopPropagation();
		console.log('dblclick', graphName);
		const { GetGraphStore } = await import('$houdini');
		const graphStore = new GetGraphStore();
		const responseData = (await graphStore.fetch({ variables: { id: graphId } })).data?.graph.data;
		if (responseData === undefined) {
			throw new Error('Graph not found');
		}
		const graphData = JSON.parse(responseData) as NodeEditorSaveData;
		console.log('fetched: graph: ', graphData);

		console.log('broadcast: edit:', graphData.editorName);
		await editMacroNodeChannel.postMessage({ graph: graphData });
	}

	function onDragStart(event: DragEvent) {
		console.log('dragstart', graphName);
		event.dataTransfer?.setData('rete/macronode', graphId);
		return event;
	}
</script>

<div
	role="button"
	tabindex="0"
	draggable="true"
	on:dblclick={ondblclick}
	on:dragstart={onDragStart}
	class="card card-hover overflow-hidden variant-filled w-52"
>
	<header>
		<img
			draggable="false"
			src="https://source.unsplash.com/vjUokUWbFOs/400x175"
			class="bg-black/50 w-full aspect-[21/9]"
			alt="Post"
		/>
	</header>
	<div class="p-4 space-y-4">
		<h6 class="h6"><div class="placeholder w-24 h-2" /></h6>
		<!-- <h3 class="h3"><div class="placeholder w-32" /></h3> -->
		<h3 class="h3">{graphName}</h3>
	</div>

	<hr class="opacity-50" />
	<footer class="p-4 flex justify-start items-center space-x-4">
		<Fa icon={faUser} class="w-8" />
		<div class="flex-auto flex justify-between items-center">
			<h6 class="font-bold">
				{$_('card.graphItem.by_author', { values: { name: authorName } })}
			</h6>
			<small>On {new Date().toLocaleDateString()}</small>
		</div>
	</footer>
</div>
