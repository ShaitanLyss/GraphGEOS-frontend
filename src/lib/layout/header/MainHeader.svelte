<script lang="ts">
	import { LocaleSwitcher, ThemeSwitcher } from '$lib/global';
	import { Tabs, type TabProps, HeaderButton } from '$lib/layout';
	import { faUser } from '@fortawesome/free-regular-svg-icons';
	import { faEllipsisH, faFileCode, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	export let titleButtonUrl = '/';
	export let tabs: TabProps[] = [];
	export let tabSet: string | undefined = undefined;
	export let clearTabs: () => void;
</script>

<div class="flex" style="height: 2.63em;">
	<h1 class="h3 mx-auto my-auto pb-1.5 w-20 text-center">
		<span
			class="bg-gradient-to-tr from-red-900 to-yellow-700 dark:from-red-500 dark:to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
		>
			<a href={titleButtonUrl}> GEOS </a>
		</span>
	</h1>
	<div class="overflow-x-hidden flex-grow">
		<!-- flex items-end-->
		<div class="overflow-x-auto select-none">
			<Tabs {tabs} bind:tabSet bind:clearTabs />
		</div>
	</div>
	<div class="group ml-auto pe-4 relative h-auto">
		<div class="h-full overflow-hidden">
			<div
				class="opacity-0 transition-all group-hover:opacity-100 flex h-full
						divide-x-8 items-center justify-end text-surface-900-50-token
						overflow-hidden translate-x-20 group-hover:translate-x-0 ps-6
						"
			>
				<div class="flex gap-3 items-center">
					<a href="/auth" class="p-1">
						<Fa icon={faUser} size="sm" class="opacity-80" />
					</a>
					<a href="/code-editor" class="p-1">
						<Fa icon={faFileCode} size="sm" class="opacity-80" />
					</a>
				</div>
				<div class="border-surface-100-800-token flex gap-3 items-center">
					<HeaderButton icon={faPaintBrush} content={ThemeSwitcher} popupArrow={false} />

					<LocaleSwitcher />
					<LightSwitch />
				</div>
			</div>
			<div
				class="absolute inset-0 transition-opacity group-hover:opacity-0 opacity-50 pe-4 flex justify-end items-center pointer-events-none"
			>
				<Fa icon={faEllipsisH} size="2x" />
			</div>
		</div>
	</div>
</div>
