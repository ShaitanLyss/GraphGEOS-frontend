<script lang="ts">
	import { faFilter, faStar, faUser, faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';
	// import { faStar, faUser } from '@fortawesome/free-regular-svg-icons';
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { moonMenuVisibleStore } from '$lib/menu/context-menu/moonContextMenu';
	import Fa from 'svelte-fa';
	import { isLoading, _ } from 'svelte-i18n';
	import GraphSearchPanel from './GraphSearchPanel.svelte';
	import { fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { getContext } from '$lib/global';

	const session = getContext('session');

	let currentTile: string | undefined = undefined;
	let drawerMode = false;

	function onTileClick(tile: string) {
		if (currentTile && currentTile === tile) {
			currentTile = undefined;
			return;
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if ($moonMenuVisibleStore) return;
		// Check if the event target is an input, textarea, or has contenteditable attribute
		const ignoreElements = ['INPUT', 'TEXTAREA'];
		if (ignoreElements.includes(e.target?.tagName) || e.target.contentEditable === 'true') {
			return;
		}

		if (
			e.key.toLowerCase() === 'f' &&
			e.ctrlKey === false &&
			e.altKey === false &&
			e.shiftKey === false
		) {
			if (currentTile === 'favorites') {
				currentTile = undefined;
				return;
			}
			e.preventDefault();
			currentTile = 'favorites';
			return;
		}

		if (
			e.key.toLowerCase() === 'u' &&
			e.ctrlKey === false &&
			e.altKey === false &&
			e.shiftKey === false
		) {
			if (currentTile === 'user') {
				currentTile = undefined;
				return;
			}
			e.preventDefault();
			currentTile = 'user';
			return;
		}

		if (
			e.key.toLowerCase() === 's' &&
			e.ctrlKey === false &&
			e.altKey === false &&
			e.shiftKey === false
		) {
			if (currentTile === 'shared') {
				currentTile = undefined;
				return;
			}
			e.preventDefault();
			currentTile = 'shared';
			return;
		}
	}
	if (browser) {
		document.addEventListener('keydown', onKeyDown);
		onDestroy(() => {
			document.removeEventListener('keydown', onKeyDown);
		});
	}
	console.log(session);
</script>

<div class="flex h-full" in:fade out:fade={{ duration: 200 }}>
	<AppRail regionDefault="select-none">
		<AppRailTile
			bind:group={currentTile}
			name="favorites"
			value={'favorites'}
			tile="favorites"
			on:click={() => onTileClick('favorites')}
		>
			<svelte:fragment slot="lead">
				<Fa class="text-2xl mx-auto" icon={faStar} />
			</svelte:fragment>
			<span>{$_('browser.tab.favorite')}</span>
		</AppRailTile>
		<AppRailTile
			bind:group={currentTile}
			name="user"
			value={'user'}
			tile="user"
			on:click={() => onTileClick('user')}
		>
			<svelte:fragment slot="lead">
				<Fa class="text-2xl mx-auto" icon={faUser} />
			</svelte:fragment>
			<span>{$_('browser.tab.user')}</span>
		</AppRailTile>
		<AppRailTile
			bind:group={currentTile}
			name="shared"
			value={'shared'}
			tile="shared"
			on:click={() => onTileClick('shared')}
		>
			<svelte:fragment slot="lead">
				<Fa class="text-2xl mx-auto" icon={faGlobe} />
			</svelte:fragment>
			<span>{$_('browser.tab.shared')}</span>
		</AppRailTile>
	</AppRail>

	{#if currentTile}
		<div
			class="max-h-full overflow-y-auto overflow-x-clip"
			transition:slide={{ axis: 'x', duration: 200 }}
		>
			{#if currentTile === 'favorites'}
				<GraphSearchPanel userId={session?.user.id} favorite={true} />
			{:else if currentTile === 'user'}
				<GraphSearchPanel authorId={session?.user.id} />
			{:else if currentTile === 'shared'}
				<GraphSearchPanel userId={session?.user.id} publicGraphs={true} />
			{/if}
		</div>
	{/if}
</div>
