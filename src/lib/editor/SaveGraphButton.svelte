<script lang="ts">
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
    import { notifications } from '@mantine/notifications';
	import EditorButton from './EditorButton.svelte';
</script>

<EditorButton
    onClick={() => {
        notifications.show({title: 'Save', message: 'Saving graph...'});
    }}
    icon={faFloppyDisk}
/>
