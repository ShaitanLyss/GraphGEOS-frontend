<script lang="ts">
	import { GlobalPopup, GlobalTooltip } from '.';
	import { getContext } from '../context';

	const popupContext = getContext('globalPopups');
</script>

{#each Object.entries(popupContext.globalPopupsProps) as [target, globalPopupProps]}
	<GlobalPopup {target} {globalPopupProps} />
{/each}

{#each Object.entries(popupContext.globalTooltipsProps) as [target, globalTooltipProps]}
	<GlobalTooltip {target} {globalTooltipProps} />
{/each}
