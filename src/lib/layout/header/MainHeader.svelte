<script lang="ts">
	import { LocaleSwitcher, ThemeSwitcher, _ } from '$lib/global';
	import { Tabs, type TabProps, HeaderButton, type TabContext } from '$lib/layout';
	import { faUser } from '@fortawesome/free-regular-svg-icons';
	import {
		faCircleNodes,
		faEllipsisH,
		faFileCode,
		faPaintBrush,
		faShareNodes,
		faTachographDigital
	} from '@fortawesome/free-solid-svg-icons';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	import HeaderLink from './HeaderLink.svelte';

	export let titleButtonUrl = '/';
	export let tabsContext: TabContext;
</script>

<div class="flex" style="height: 2.63em;">
	<h1 class="h3 mx-auto my-auto pb-1.5 w-20 text-center select-none">
		<span
			class="bg-gradient-to-tr from-red-900 to-yellow-700 dark:from-red-500 dark:to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
		>
			<a href={titleButtonUrl}> GEOS </a>
		</span>
	</h1>
	<div class="overflow-x-hidden flex-grow">
		<!-- flex items-end-->
		<div class="overflow-x-auto select-none">
			<Tabs bind:tabsContext />
		</div>
	</div>
	<div class="group ml-auto pe-4 relative h-auto">
		<div class="h-full overflow-hidden">
			<div
				class="opacity-0 transition-all group-hover:opacity-100 flex h-full
						items-center justify-end text-surface-900-50-token
						overflow-hidden translate-x-20 group-hover:translate-x-0 ps-6
						"
			>
				<div class="flex gap-0 items-center me-1">
					<HeaderLink
						href="/"
						icon={faCircleNodes}
						tooltip={$_('header.link.graph-editor.tooltip')}
						shortcut="g"
					/>
					<HeaderLink
						href="/code-editor"
						icon={faFileCode}
						tooltip={$_('header.link.code-editor.tooltip')}
						shortcut="c"
					/>
					<HeaderLink
						href="/auth"
						icon={faUser}
						tooltip={$_('header.link.auth.tooltip')}
						shortcut="a"
					/>
				</div>
				<span class="divider-vertical border-surface-400-500-token h-4 my-auto" />
				<div class="flex gap-3 items-center ms-3">
					<HeaderButton
						icon={faPaintBrush}
						content={ThemeSwitcher}
						popupArrow={false}
						tooltip={$_('main.header.button.theme-switcher.tooltip')}
					/>
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
