<script lang="ts">
	import { faCalendarTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
	import { notifications } from '@mantine/notifications';
	import Fa from 'svelte-fa';
	import { onMount } from 'svelte';
	import type { NodeEditor } from '$rete/NodeEditor';
	import EditorButton from './EditorButton.svelte';
	import { _ } from 'svelte-i18n';
	import type { NodeFactory } from '$rete/node/NodeFactory';

	export let factory: NodeFactory;

	let fileInput: HTMLInputElement;

	async function loadGraph(event: Event) {
		if (!factory) {
			console.error('No factory found');
			return;
		}
		if (!fileInput.files) {
			console.error('No files found');
			return;
		}
		const file = fileInput.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			try {
				const content = e.target?.result as string;
				const parsedGraph = JSON.parse(content);
				// Process the parsedGraph as needed
				await factory.loadGraph(parsedGraph);
				notifications.show({
					title: $_('notification.graph_loaded.title'),
					message: $_('notification.graph_loaded.message'),
					color: 'green'
				});
			} catch (error) {
				notifications.show({ title: 'Error', message: 'Failed to load the graph.', color: 'red' });
				console.error(error);
			}
		};

		reader.readAsText(file);
	}
</script>

<input type="file" bind:this={fileInput} accept=".txt" on:change={loadGraph} hidden />
<EditorButton on:click={() => fileInput.click()} icon={faUpload} />
