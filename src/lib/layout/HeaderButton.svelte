<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { globalPopupProps } from '$lib/layout';
	import { ThemeSwitcher } from '$lib/global';
	import type { ComponentType } from 'svelte';

	export let content: ComponentType | string = 'Missing popup content';
	export let icon: IconDefinition;
	export let popupArrow = true;
	const popupClick: PopupSettings = {
		event: 'focus-click',
		target: 'globalPopup',
		placement: 'bottom-start',
		middleware: { offset: { crossAxis: 10, mainAxis: 5 } }
	};
	$globalPopupProps = { arrow: popupArrow, content: content };
</script>

<button class="p-1" use:popup={popupClick}>
	<Fa {icon} size="sm" class="opacity-80" />
</button>
