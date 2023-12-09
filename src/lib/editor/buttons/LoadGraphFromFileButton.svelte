<script lang="ts">
	import { faCalendarTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
	import { notifications } from '@mantine/notifications';
	import EditorButton from './EditorButton.svelte';
	import { _ } from '$lib/global';
	import type { NodeFactory } from '$rete/node/NodeFactory';

	let factory: NodeFactory;
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
				notifications.show({
					title: $_('notification.error.title'),
					message: $_('notification.graph_loaded.failure_msg'),
					color: 'red'
				});
				console.error(error);
			}
		};

		reader.readAsText(file);
	}
</script>

<input type="file" bind:this={fileInput} accept=".txt" on:change={loadGraph} hidden />
<EditorButton
	exec={({ factory }) => {
		factory = factory;
		fileInput.click();
	}}
	icon={faUpload}
	tooltip={$_('editor.button.load-graph-from-file')}
/>
