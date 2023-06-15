<script lang="ts">
	import { faDownload } from "@fortawesome/free-solid-svg-icons";
	import { notifications } from "@mantine/notifications";
	import Fa from "svelte-fa";
	import type { NodeEditor } from "$rete/NodeEditor";
	import EditorButton from "./EditorButton.svelte";

	export let editor: NodeEditor;
	
	function downloadGraph() {
		// notifications.show({title: 'Download', message: 'Downloading graph...'});
    const content = '{descr: "This is the content of the file."}';
    const filename = 'editor.txt';
    const blob = new Blob([content], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
    link.remove();
  }

</script>

<EditorButton onClick={downloadGraph} icon={faDownload} />