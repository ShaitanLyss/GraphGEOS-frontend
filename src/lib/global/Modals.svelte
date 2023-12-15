<script lang="ts">
	import { Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';
	import UploadGraphModal from '$lib/modals/UploadGraphModal.svelte';

	const modalComponentRegistry: Record<string, ModalComponent> = {
		uploadGraphModal: {
			ref: UploadGraphModal
		}
	};
</script>

<Modal components={modalComponentRegistry} />
