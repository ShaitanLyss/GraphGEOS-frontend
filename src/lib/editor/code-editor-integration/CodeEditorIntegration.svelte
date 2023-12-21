<script lang="ts">
	import { CodeEditor } from '$lib/code-editor';
	import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import type { EditorContext } from '..';
	import CodeEditorIntegrationButton from './CodeEditorIntegrationButton.svelte';
	import { notifications } from '@mantine/notifications';
	import { ErrorWNotif } from '$lib/global';

	export let editorContext: EditorContext;

	function pull() {
		notifications.show({ message: 'Pull' });
		const factory = editorContext.getActiveFactory();
		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();
		console.log(factory.selector.entities);
	}
	function push() {
		notifications.show({ message: 'Push' });
	}
	function download() {
		notifications.show({ message: 'Download' });
	}
</script>

<div class="absolute h-full top-0 -translate-x-1/2 z-10 nope-pt-[2.64rem] pointer-events-none">
	<div class="h-full flex flex-col gap-2 justify-center pointer-events-none">
		<CodeEditorIntegrationButton icon={faArrowRight} flip={'horizontal'} on:click={push} />
		<CodeEditorIntegrationButton icon={faArrowRight} on:click={pull} />
		<CodeEditorIntegrationButton icon={faArrowDown} on:click={download} />
	</div>
</div>
<CodeEditor width="40vw" border="border-s-2 border-surface-100-800-token" />
