<script lang="ts">
	import { faCloud } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { _ } from 'svelte-i18n';
	let openUploadGraphModal = () => {
		console.log('hey');
	};
</script>

<EditorButton
	icon={faCloud}
	exec={openUploadGraphModal}
	tooltip={$_('editor.button.upload-graph.tooltip')}
/>
