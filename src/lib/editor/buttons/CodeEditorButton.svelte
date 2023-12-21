<script lang="ts">
	import { faFileCode } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { _, getContext } from '$lib/global';
	import type { CodeEditorIntegration } from '$lib/editor';
	import { onMount } from 'svelte';
	const mainRightSideBar = getContext<'mainRightSideBar', CodeEditorIntegration>(
		'mainRightSideBar'
	);
	const editorContext = getContext('editor');

	async function toggleCodeEditor() {
		const { CodeEditorIntegration } = await import('$lib/editor');
		if ($mainRightSideBar.component === CodeEditorIntegration) {
			$mainRightSideBar = { component: undefined };
			return;
		}
		$mainRightSideBar = {
			component: CodeEditorIntegration,
			props: { editorContext }
		};
	}

	onMount(async () => {
		await toggleCodeEditor();
	});
</script>

<EditorButton
	icon={faFileCode}
	tooltip={$_('editor.button.toggle-code-editor.tooltip')}
	execNoNeedActiveFactory={toggleCodeEditor}
/>
