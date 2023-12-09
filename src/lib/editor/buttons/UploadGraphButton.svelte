<script lang="ts">
	import { faCloud } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { _ } from '$lib/global';
	let openUploadGraphModal = () => {
		console.log('hey');
	};
</script>

<EditorButton
	icon={faCloud}
	exec={openUploadGraphModal}
	tooltip={$_('editor.button.upload-graph.tooltip')}
/>
