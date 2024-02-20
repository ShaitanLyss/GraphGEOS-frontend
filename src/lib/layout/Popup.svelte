<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { ComponentType } from 'svelte';

	export let target: string;
	export let content: ComponentType | string = 'Missing tooltip';
	export let classList = '';
	export let background = 'variant-filled-secondary';
	export let padding = 'p-4';
	let class_: string = '';
	export { class_ as class };
	export let arrow = true;
	// export let popupSettings: PopupSettings = {event: "hover", ta};
</script>

<div class="card {padding} {background} {classList} {class_}" data-popup={target}>
	<div class="flex flex-col items-center gap-2">
		<slot>
			{#if typeof content === 'string'}
				<p>{content}</p>
			{:else}
				<svelte:component this={content} />
			{/if}
		</slot>
	</div>
	{#if arrow}
		<div class="arrow {background}" />
	{/if}
</div>
