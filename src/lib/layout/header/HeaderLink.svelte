<script lang="ts">
	import { getContext, globalTooltip } from '$lib/global';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';

	import Fa from 'svelte-fa';
	export let icon: IconDefinition;
	export let opacity = 'opacity-80';
	export let href: string;
	export let tooltip: string;
	const globalPopupContext = getContext('globalPopups');
	const save = getContext('onSave');
	$: isCurrentPage = $page.route.id === href || $page.url.pathname === href;
</script>

<a
	{href}
	class="px-3 py-4"
	class:text-tertiary-800-100-token={isCurrentPage}
	use:globalTooltip={{ globalPopupContext, content: tooltip, event: 'hover' }}
	on:click={() => save({ displaySuccess: false })}
>
	<Fa {icon} size="sm" class={`${isCurrentPage ? 'cool-spin' : opacity}`} />
</a>
