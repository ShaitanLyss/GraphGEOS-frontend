<script lang="ts">
	console.log('check document ', typeof document !== undefined && document);
	console.log('check window ', typeof window !== undefined && window);

	import '../localization/i18n';
	// import '$rete/setup/appLaunch';
	import { Notifications } from '@mantine/notifications';
	import UploadGraphModal from '$lib/modals/UploadGraphModal.svelte';
	import { onMount } from 'svelte';
	import { AppShell, LightSwitch, Modal, type ModalComponent, initializeStores, setInitialClassState } from '@skeletonlabs/skeleton';
	

	console.log('layout .svelte');

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import 'app.css'
	import '../app.postcss';
	import { init } from 'svelte-i18n';
	import MoonContextMenu from '$lib/context-menu/MoonContextMenu.svelte';
	import { moonMenuVisibleStore } from '$lib/context-menu/moonContextMenu';
	
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
<svelte:head>{@html `<\u{73}cript>(${setInitialClassState.toString()})();</script>`}</svelte:head>
