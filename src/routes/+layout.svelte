<script lang="ts">
	console.log('check document ', typeof document !== 'undefined' && document);
	console.log('check window ', typeof window !== 'undefined' && window);

	import '../localization/i18n';
	// import '$rete/setup/appLaunch';

	// Setup Popups with floating-ui
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import { Notifications } from '@mantine/notifications';
	import UploadGraphModal from '$lib/modals/UploadGraphModal.svelte';
	import { onMount } from 'svelte';
	import {
		AppShell,
		LightSwitch,
		Modal,
		type ModalComponent,
		initializeStores,
		setInitialClassState
	} from '@skeletonlabs/skeleton';

	export let data: LayoutData;

	console.log('layout .svelte');
	console.log('layou data ', data);
	if (isAuthEnabled() && !('session' in data) && window.location.pathname !== '/auth') {
		goto(`/auth?redirect=${window.location.pathname}`);
	}

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import 'app.css'
	import '../app.postcss';
	import { init } from 'svelte-i18n';
	import MoonContextMenu from '$lib/menu/context-menu/MoonContextMenu.svelte';
	import { moonMenuVisibleStore } from '$lib/menu/context-menu/moonContextMenu';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { isAuthEnabled } from '$utils/config';

	initializeStores();

	let i = 0;

	// import '@skeletonlabs/skeleton/styles/partials/typography-prose.css';
	let isi18setup = false;
	onMount(async () => {
		console.log('layout on mount');
		window._init = init;
	});

	const modalComponentRegistry: Record<string, ModalComponent> = {
		uploadGraphModal: {
			ref: UploadGraphModal
		}
	};
	// import { graphql } from '$houdini';
</script>

<slot />

<react:Notifications position="top-right" zIndex="1000" />

<MoonContextMenu />

<Modal components={modalComponentRegistry} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html `<\u{73}cript>(${setInitialClassState.toString()})();</script>`}</svelte:head>
