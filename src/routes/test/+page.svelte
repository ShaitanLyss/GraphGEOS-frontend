<script lang="ts">
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import '$rete/imports';
	import { sumExample } from '$rete/example/math';
	import { timeloopExample } from '$rete/example/timeloop';
	import { forEachExample } from '$rete/example/for_each';
	import { acquisitionModelingExample } from '$rete/example/acquisition-modeling';
	import GraphSearchPanel from '$lib/editor/node-browser/GraphSearchPanel.svelte';
	import GraphItem from '$lib/editor/node-browser/GraphItem.svelte';
	import Fa from 'svelte-fa';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { _ } from 'svelte-i18n';
	import Editor from '$lib/editor/Editor.svelte';

	let tab = 0;
</script>

<div class="h-screen overflow-auto">
	<TabGroup>
		<Tab bind:group={tab} value={0}>Bonjour</Tab>
		<Tab bind:group={tab} value={1}>Hello</Tab>
	</TabGroup>
	<AppShell slotPageContent="h-full" regionPage="h-full" slotSidebarLeft="h-full">
		<!-- Editor -->
		<svelte:fragment slot="sidebarLeft">
		<div class="h-full px-4 pb-36 overflow-auto">
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
				<div class="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-4">
					<GraphItem />
					<GraphItem />
					<GraphItem />
					<GraphItem />
				</div>
			</div>

			<div class="mb-4">
				<h2 class="h2 mb-4">{$_('title.recents')}</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-4">
					<GraphItem />
					<GraphItem />
					<GraphItem />
					<GraphItem />
				</div>
			</div>
		</div>
		</svelte:fragment>
		
		<!-- <Editor name="Editor" /> -->
	</AppShell>
</div>



