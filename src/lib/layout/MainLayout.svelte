<script lang="ts">
	import {
		setContext,
		GlobalPopups,
		type RightSidebar,
		makeGlobalPopupContext,
		makeGlobalPopupsProps,
		type SaveHandler,
		_,
		type resolveContext,
		notifications
	} from '$lib/global';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { writable, type Writable } from 'svelte/store';
	import { MainHeader, type TabContext } from '$lib/layout';
	import type { SvelteComponent } from 'svelte';
	import { browser } from '$app/environment';
	import { getLocalStorageUsagePercent } from '$utils/localStorage';
	import { redirect } from '@sveltejs/kit';

	const numGlobalTooltips = 3;
	let tooltipUseCount = 0;
	const numGlobalPopups = 3;
	let globalPopupUseCount = 0;
	const saveContext: Writable<Map<string, SaveHandler>> = writable(new Map());

	setContext('save', saveContext);

	const onSave: resolveContext<'onSave'> = ({ displaySuccess = true } = {}) => {
		if (displaySuccess)
			notifications.show({
				title: $_('notification.save.title'),
				message: $_('notification.save.message.ongoing'),
				id: 'save',
				color: 'blue',
				withCloseButton: false
			});

		let mistakesCounts = 0;
		$saveContext.forEach((handler) => {
			try {
				handler.save();
			} catch (e) {
				mistakesCounts++;
				displaySuccess = false;
				console.error(e);
			}
		});
		notifications.hide('save');
		if (mistakesCounts > 0) {
			notifications.show({
				title: $_('notification.save.title'),
				message: $_('notification.save.message.failure', {
					values: { error: `${mistakesCounts} errors` }
				}),
				color: 'red'
			});
		}
		if (displaySuccess) {
			const storageUse = getLocalStorageUsagePercent() ?? 0;
			notifications.show({
				autoClose: storageUse < 0.8 ? 1100 : 2000,
				// withCloseButton: storageUse > 0.8,
				title: $_('notification.save.title'),
				message:
					storageUse < 0.8
						? $_('notification.save.message.success-no-storage-use')
						: $_('notification.save.message.success', {
								values: { storageUse: getLocalStorageUsagePercent() }
							}),
				color: 'green'
			});
		}
	};
	setContext('onSave', onSave);
	if (browser)
		document.addEventListener('keydown', (e) => {
			if (e.key === undefined) return;
			if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				onSave();
			}
		});
	setContext('globalPopups', {
		nextPopupKey: () => globalPopupUseCount++ % numGlobalPopups,
		nextTooltipKey: () => tooltipUseCount++ % numGlobalTooltips,
		globalTooltipsProps: makeGlobalPopupsProps({ type: 'tooltip', num: numGlobalTooltips }),
		globalPopupsProps: makeGlobalPopupsProps({ type: 'popup', num: numGlobalPopups })
	});

	// Tabs
	let tabsContext: Writable<TabContext> = writable();
	setContext('tabs', tabsContext);

	// Right Sidebar
	const mainRightSidebar = writable<RightSidebar<SvelteComponent>>({});
	setContext('mainRightSideBar', mainRightSidebar);
</script>

<GlobalPopups />
<AppShell slotPageContent="relative" regionPage="overflow-hidden">
	<svelte:fragment slot="header">
		<MainHeader bind:tabsContext={$tabsContext} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<slot name="sidebarLeft" />
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		{#if $mainRightSidebar !== undefined}
			<svelte:component this={$mainRightSidebar.component} {...$mainRightSidebar.props} />
		{/if}
	</svelte:fragment>

	<svelte:fragment>
		<slot />
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<slot name="footer" />
	</svelte:fragment>
</AppShell>
