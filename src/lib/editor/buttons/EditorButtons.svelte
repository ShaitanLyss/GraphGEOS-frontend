<script lang="ts">
	import {
		DownloadGraphButton,
		LoadGraphFromFileButton,
		SaveGraphButton,
		ToPythonButton,
		ToggleGeosButton,
		UploadGraphButton
	} from '.';
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
		<UploadGraphButton />
		<ToggleGeosButton />
	</div>
</div>
