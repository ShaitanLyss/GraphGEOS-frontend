<script lang="ts">
	import LocaleSwitcher from '$lib/global/LocaleSwitcher.svelte';
	import { faUser } from '@fortawesome/free-regular-svg-icons';
	import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
	import { TabGroup, LightSwitch, AppShell, modeCurrent } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	export let titleButtonUrl = '/';
</script>

<AppShell slotPageContent="relative">
	<svelte:fragment slot="header">
		<div class="flex">
			<h1 class="h3 mx-auto px-2 my-auto pb-1.5">
				<span
					class="bg-gradient-to-tr from-red-900 to-yellow-700 dark:from-red-500 dark:to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
				>
					<a href={titleButtonUrl}> GEOS </a>
				</span>
			</h1>
			<div class="overflow-x-hidden flex-grow">
				<div class="overflow-x-auto select-none">
					<TabGroup regionList={'overflow-x-visible'} border="">
						<slot name="tabs" />
					</TabGroup>
				</div>
			</div>
			<div class="group ml-auto pe-4 relative h-auto">
				<div class="h-full overflow-hidden">
					<div
						class="opacity-0 transition-all group-hover:opacity-100 flex h-full
						space-x-3 items-center justify-end text-surface-900-50-token
						overflow-hidden translate-x-20 group-hover:translate-x-0 ps-6
						"
					>
						<a href="/auth" class="p-1">
							<Fa icon={faUser} size="sm" class="opacity-80" />
						</a>
						<LocaleSwitcher />
						<LightSwitch />
					</div>
					<div
						class="absolute inset-0 transition-opacity group-hover:opacity-0 opacity-50 pe-4 flex justify-end items-center pointer-events-none"
					>
						<Fa icon={faEllipsisH} size="2x" />
					</div>
				</div>
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<slot name="sidebarLeft" />
	</svelte:fragment>

	<svelte:fragment>
		<slot />
	</svelte:fragment>
</AppShell>
