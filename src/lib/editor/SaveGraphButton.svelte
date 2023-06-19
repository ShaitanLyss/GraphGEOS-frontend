<script lang="ts">
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
	import { notifications } from '@mantine/notifications';
	import EditorButton from './EditorButton.svelte';
	import type { NodeEditor } from '$rete/NodeEditor';

	export let editor: NodeEditor;

	function saveGraph() {
		notifications.show({ title: 'Save', message: 'Saving graph...' });
		console.log(JSON.stringify(editor));
	}
</script>

<EditorButton onClick={saveGraph} icon={faFloppyDisk} />
