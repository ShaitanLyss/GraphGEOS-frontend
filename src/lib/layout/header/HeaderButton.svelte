<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { type ComponentType } from 'svelte';
	import {
		globalPopup,
		type GlobalPopupActionParams,
		_,
		getContext,
		globalTooltip
	} from '$lib/global';

	export let content: ComponentType | string;
	export let icon: IconDefinition;
	export let tooltip = 'Missing tooltip';
	export let popupArrow = true;

	const popupClick: GlobalPopupActionParams = {
		event: 'focus-click',
		placement: 'bottom-start',
		middleware: { offset: { crossAxis: 10, mainAxis: 5 } },
		content: content,
		arrow: popupArrow,
		globalPopupContext: getContext('globalPopups')
	};
	const tooltipPopup: GlobalPopupActionParams = {
		globalPopupContext: getContext('globalPopups'),
		event: 'hover',
		placement: 'bottom',
		content: tooltip,
		arrow: true
	};
</script>

<button class="p-1" use:globalPopup={popupClick} use:globalTooltip={tooltipPopup}>
	<Fa {icon} size="sm" class="opacity-80" />
</button>
