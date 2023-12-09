<script lang="ts">
	import Editor from '$lib/editor/NewEditor.svelte';
	let editors: number[] = [1];
</script>

{#each editors as editor, index (editor)}
	<Editor />
{/each}
