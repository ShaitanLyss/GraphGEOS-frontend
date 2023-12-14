<script lang="ts">
	import { browser } from '$app/environment';
	import CodeEditor from '$lib/code-editor/CodeEditor.svelte';
</script>

{#if browser}
	<CodeEditor width="100%" height="100%" />
{/if}
