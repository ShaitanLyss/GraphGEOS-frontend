<script lang="ts">
	import { onMount } from 'svelte';
	import { GlobalPopup, GlobalTooltip } from '.';
	import { getContext } from '../context';
	import { isBrowser } from '$houdini';

	const popupContext = getContext('globalPopups');

	let MoonContextMenu:
		| typeof import('$lib/menu/context-menu/MoonContextMenu.svelte').default
		| undefined = undefined;
	onMount(async () => {
		if (isBrowser) {
			MoonContextMenu = (await import('$lib/menu/context-menu/MoonContextMenu.svelte')).default;
		}
	});
</script>

<svelte:component this={MoonContextMenu} searchbar={true} />
{#each Object.entries(popupContext.globalPopupsProps) as [target, globalPopupProps]}
	<GlobalPopup {target} {globalPopupProps} />
{/each}

{#each Object.entries(popupContext.globalTooltipsProps) as [target, globalTooltipProps]}
	<GlobalTooltip {target} {globalTooltipProps} />
{/each}
