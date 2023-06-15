<script lang="ts">
	import '../localization/i18n';
	import '../app.postcss';
	import { Notifications } from '@mantine/notifications';
	import UploadGraphModal from '$lib/modals/UploadGraphModal.svelte';

	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-modern.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import 'app.css'
	import '../app.postcss';
	
	import { AppShell, LightSwitch, Modal, ModalComponent } from '@skeletonlabs/skeleton';
	const modalComponentRegistry: Record<string, ModalComponent> = {
		uploadGraphModal: {
			ref: UploadGraphModal
		}
	}
	import { setInitialClassState } from '@skeletonlabs/skeleton';
</script>

<slot />
<react:Notifications position="top-right" />
<Modal components={modalComponentRegistry}/>
<svelte:head>{@html `<\u{73}cript>(${setInitialClassState .toString()})();</script>`}</svelte:head>
