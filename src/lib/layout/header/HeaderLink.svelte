<script lang="ts">
	import { getContext, globalPopup } from '$lib/global';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	import Fa from 'svelte-fa';
	export let icon: IconDefinition;
	export let opacity = 'opacity-80';
	export let href: string;
	export let tooltip: string;
	const globalPopupContext = getContext('globalPopups');
</script>

<a {href} class="px-3 py-4" use:globalPopup={{ type: 'tooltip', content: tooltip, event: 'hover' }}>
	<Fa {icon} size="sm" class={opacity} />
</a>
