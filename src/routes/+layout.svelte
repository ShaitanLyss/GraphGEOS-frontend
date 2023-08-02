<script lang="ts">
	console.log("check document ", typeof document !== undefined && document)
	console.log("check window ", typeof window !== undefined && window)
	
	// import '$rete/setup/appLaunch';
	import { Notifications } from '@mantine/notifications';
	import UploadGraphModal from '$lib/modals/UploadGraphModal.svelte';
	import { onMount } from 'svelte';
	import { setInitialClassState } from '@skeletonlabs/skeleton';
	import { AppShell, LightSwitch, Modal, type ModalComponent } from '@skeletonlabs/skeleton';

	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import 'app.css'
	import '../app.postcss';
	import { init } from 'svelte-i18n';
	
	let i = 0;
		
	// import '@skeletonlabs/skeleton/styles/partials/typography-prose.css';
	let isi18setup = false;
	onMount(async () => {
		await import('../localization/i18n')
		isi18setup = true;
		await import('$rete/setup/appLaunch');
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
{#if isi18setup}
<Modal components={modalComponentRegistry} />
{/if}
<svelte:head>{@html `<\u{73}cript>(${setInitialClassState.toString()})();</script>`}</svelte:head>
