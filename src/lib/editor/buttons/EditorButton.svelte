<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import newUniqueId from 'locally-unique-id-generator';

	export let icon: IconDefinition;
	export let active = false;
	export let tooltip = 'Missing tooltip';

	const target = 'buttonTooltip-' + newUniqueId();
	const popupHover: PopupSettings = {
		event: 'hover',
		target: target,
		placement: 'bottom'
	};
</script>

<div class="card p-4 variant-filled-secondary" data-popup={target}>
	<p>{tooltip}</p>
	<div class="arrow variant-filled-secondary" />
</div>
<button
	use:popup={popupHover}
	class="btn-icon [&>*]:pointer-events-none {active
		? 'variant-ghost-success'
		: 'variant-ghost-secondary'} pointer-events-auto"
	on:*><Fa {icon} /></button
>
