<script lang="ts">
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
	import { notifications } from '@mantine/notifications';
	import { _ } from '$lib/global';
	import EditorButton from './EditorButton.svelte';
	import { getContext } from '$lib/global';
	import { getLocalStorageUsagePercent as getLocalStorageUsage } from '$utils/localStorage';
	import { ErrorWNotif } from '$lib/global/error';

	const onSave = getContext('onSave');

	function saveGraph() {
		notifications.show({
			title: $_('notification.save.title'),
			message: $_('notification.save.message.ongoing'),
			id: 'save',
			color: 'blue',
			withCloseButton: false
		});
		if (onSave === undefined) throw new ErrorWNotif({ emessage: 'onSave not defined' });
		try {
			onSave();
			notifications.hide('save');
			notifications.show({
				autoClose: 2000,
				title: $_('notification.save.title'),
				message: $_('notification.save.message.success', {
					values: { storageUse: getLocalStorageUsage() }
				}),
				color: 'green'
			});
		} catch (e) {
			notifications.hide('save');
			notifications.show({
				title: $_('notification.save.title'),
				message: $_('notification.save.message.failure', {
					values: { error: (e as Error).toString() }
				}),
				color: 'red'
			});
		}
	}
</script>

<EditorButton
	execNoNeedActiveFactory={saveGraph}
	icon={faFloppyDisk}
	tooltip={$_('editor.button.save')}
/>
