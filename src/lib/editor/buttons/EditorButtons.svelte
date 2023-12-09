<script lang="ts">
	import { faCloud } from '@fortawesome/free-solid-svg-icons';
	import DownloadGraphButton from './DownloadGraphButton.svelte';
	import EditorButton from './EditorButton.svelte';
	import LoadGraphFromFileButton from './LoadGraphFromFileButton.svelte';
	import SaveGraphButton from './SaveGraphButton.svelte';
	import ToPythonButton from './ToPythonButton.svelte';
	import ToggleGeosButton from './ToggleGeosButton.svelte';

	let openUploadGraphModal = () => {
		console.log('hey');
	};
</script>

<div
	class="flex
 w-full justify-between pointer-events-none p-2"
>
	<div class="flex gap-4">
		<SaveGraphButton />
		<LoadGraphFromFileButton />
		<ToPythonButton />
	</div>
	<div class="flex gap-4">
		<DownloadGraphButton />
		<EditorButton icon={faCloud} on:click={openUploadGraphModal} />
		<ToggleGeosButton />
	</div>
</div>
