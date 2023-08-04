<script lang="ts">
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
	import { notifications } from '@mantine/notifications';
	import { _ } from 'svelte-i18n';
	import EditorButton from './EditorButton.svelte';
	import { getContext } from 'svelte';

	const onSave = getContext<() => unknown>('onSave');

	function saveGraph() {
		notifications.show({ title: $_('notification.save.title'), message: $_('notification.save.message.ongoing'),id: 'save', color: 'blue', withCloseButton: false });
		if (onSave === undefined) throw new Error('onSave not defined');
		try {
		onSave();
		notifications.hide('save');
		notifications.show({ title: $_('notification.save.title'), message: $_('notification.save.message.success'), color: 'green' });
		} catch (e) {
			notifications.hide('save');
			notifications.show({ title: $_('notification.save.title'), message: $_('notification.save.message.failure', {values:{error: (e as Error).toString()}}), color: 'red' });
		}
	}
</script>

<EditorButton on:click={saveGraph} icon={faFloppyDisk} />
