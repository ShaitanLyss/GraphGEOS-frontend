<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let target: string;
	export let content: ComponentType | string = 'Missing tooltip';
	export let classList = '';
	export let arrow = true;
</script>

<div class="card p-4 variant-filled-secondary {classList}" data-popup={target}>
	<slot>
		{#if typeof content === 'string'}
			<p>{content}</p>
		{:else}
			<svelte:component this={content} />
		{/if}
	</slot>
	{#if arrow}
		<div class="arrow variant-filled-secondary" />
	{/if}
</div>
