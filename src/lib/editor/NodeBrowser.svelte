<script lang="ts">
	import { faFilter, faStar, faUser, faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';
	// import { faStar, faUser } from '@fortawesome/free-regular-svg-icons';
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';

	import Fa from 'svelte-fa';
	import { isLoading, _ } from 'svelte-i18n';
	import GraphSearchPanel from './node-browser/GraphSearchPanel.svelte';

	let currentTile: string | undefined = 'favorites';
	let drawerMode = false;

	function onTileClick(tile: string) {
		if (currentTile && currentTile === tile) {
			currentTile = undefined;
			return;
		}
	}
</script>

<div class="flex relative h-full">
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
			on:click={()=> onTileClick('shared')}
		>
			<svelte:fragment slot="lead">
				<Fa class="text-2xl mx-auto" icon={faGlobe} />
			</svelte:fragment>
			<span>{$_('browser.tab.shared')}</span>
		</AppRailTile>
	</AppRail>
	{#if currentTile === 'favorites'}
		<div class="flex flex-col variant-filled-surface overflow-auto relative" style="height: calc(100% - 4rem);">
			<GraphSearchPanel />
		</div>
	{/if}
</div>
