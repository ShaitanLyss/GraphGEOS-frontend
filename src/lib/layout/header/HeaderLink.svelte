<script lang="ts">
	import { ErrorWNotif, getContext, globalTooltip } from '$lib/global';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';

	import Fa from 'svelte-fa';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	export let icon: IconDefinition;
	export let opacity = 'opacity-80';
	export let href: string;
	export let tooltip: string;
	export let shortcut: string | undefined = undefined;
	const globalPopupContext = getContext('globalPopups');
	const save = getContext('onSave');
	$: isCurrentPage = $page.route.id === href || $page.url.pathname === href;

	if (browser && shortcut) {
		const onKeyDown = (e: KeyboardEvent) => {
			// Check if the event target is an input, textarea, or has contenteditable attribute
			// const ignoreElements = ['INPUT', 'TEXTAREA'];
			// if (ignoreElements.includes(e.target?.tagName) || e.target.contentEditable === 'true') {
			// 	return;
			// }

			if (e.key === shortcut && e.ctrlKey === false && e.altKey === true && e.shiftKey === false) {
				save({ displaySuccess: false });
				goto(href);
			}
		};

		document.addEventListener('keydown', onKeyDown);
		onDestroy(() => {
			document.removeEventListener('keydown', onKeyDown);
		});
	}
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
