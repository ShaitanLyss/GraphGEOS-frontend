<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { ComponentType } from 'svelte';
	import { globalPopup, type GlobalPopupSettings, _, globalTooltip } from '$lib/global';

	export let content: ComponentType | string = 'Missing popup content';
	export let icon: IconDefinition;
	// export let tooltip = 'Missing tooltip';
	export let popupArrow = true;

	const popupClick: GlobalPopupSettings = {
		event: 'focus-click',
		placement: 'bottom-start',
		middleware: { offset: { crossAxis: 10, mainAxis: 5 } },
		content: content,
		arrow: popupArrow
	};
	// const tooltipPopup: GlobalPopupSettings = {
	// 	event: 'hover',
	// 	placement: 'bottom',
	// 	content: tooltip,
	// 	arrow: true
	// };
</script>

<button class="p-1" use:globalPopup={popupClick}>
	<Fa {icon} size="sm" class="opacity-80" />
</button>
