<script lang="ts">
	import { faFileCode } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { _, getContext } from '$lib/global';
	import type CodeEditor from '$lib/code-editor/CodeEditor.svelte';
	const mainRightSideBar = getContext<'mainRightSideBar', CodeEditor>('mainRightSideBar');

	async function toggleCodeEditor() {
		const codeEditor = (await import('$lib/code-editor/CodeEditor.svelte')).default;
		if ($mainRightSideBar.component === codeEditor) {
			$mainRightSideBar = { component: undefined };
			return;
		}
		$mainRightSideBar = {
			component: codeEditor,
			props: { width: '40vw', border: 'border-s-2 border-surface-100-800-token' }
		};
	}
</script>

<EditorButton
	icon={faFileCode}
	tooltip={$_('editor.button.toggle-code-editor.tooltip')}
	execNoNeedActiveFactory={toggleCodeEditor}
/>
