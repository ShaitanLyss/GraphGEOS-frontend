<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { _ } from 'svelte-i18n';
	import Fa from 'svelte-fa';
	import GraphItem from './GraphItem.svelte';
</script>

<div class="px-4 pb-32">
	<!-- Searchbar -->
	<div class="flex flex-row items-center justify-between p-2 mb-2">
		<div class="flex flex-row items-center">
			<input
				type="text"
				class="input flex-grow w-full h-8 px-2 rounded-full"
				placeholder="Search"
			/>
			<div
				class="flex flex-row items-center justify-center w-8 h-8 ms-2 rounded-full bg-primary-500"
			>
				<Fa icon={faSearch} />
			</div>
		</div>
	</div>

	<div class="mb-4">
		<h2 class="h2 mb-4">{$_('title.favorite')}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-4 flex-wrap">
			<GraphItem />
			<GraphItem />
			<GraphItem />
			<GraphItem />
		</div>
	</div>

	<div class="mb-4">
		<h2 class="h2 mb-4">{$_('title.recents')}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-4 flex-wrap">
			<GraphItem />
			<GraphItem />
			<GraphItem />
			<GraphItem />
		</div>
	</div>
</div>