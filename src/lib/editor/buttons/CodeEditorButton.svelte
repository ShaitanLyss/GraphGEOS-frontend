<script lang="ts">
	import { faFileCode } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { _, getContext } from '$lib/global';
	import type { CodeEditorIntegration } from '$lib/editor';
	import { onDestroy, onMount } from 'svelte';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { moonMenuVisibleStore } from '$lib/menu/context-menu/moonContextMenu';
	const mainRightSideBar = getContext<'mainRightSideBar', CodeEditorIntegration>(
		'mainRightSideBar'
	);
	const editorContext = getContext('editor');

	const codeEditorActive = localStorageStore('codeEditorActive', false);
	// const codeEditorActive = writable(false);

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
	function onKeyDown(e: KeyboardEvent) {
		if ($moonMenuVisibleStore) return;
		// Check if the event target is an input, textarea, or has contenteditable attribute
		const ignoreElements = ['INPUT', 'TEXTAREA'];
		if (ignoreElements.includes(e.target?.tagName) || e.target.contentEditable === 'true') {
			return;
		}
		if (
			e.key.toLowerCase() === 'c' &&
			e.ctrlKey === false &&
			e.altKey === false &&
			e.shiftKey === false
		) {
			toggleCodeEditor();
		}
	}
	if (browser) {
		document.addEventListener('keydown', onKeyDown);
	}
	onDestroy(() => {
		document.removeEventListener('keydown', onKeyDown);
	});

	onMount(async () => {
		if ($codeEditorActive) await toggleCodeEditor();
	});
</script>

<EditorButton
	icon={faFileCode}
	tooltip={$_('editor.button.toggle-code-editor.tooltip')}
	execNoNeedActiveFactory={() => {
		$codeEditorActive = !$codeEditorActive;
		toggleCodeEditor();
	}}
/>
