<script lang="ts">
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
    import { notifications } from '@mantine/notifications';

	import Fa from 'svelte-fa';
</script>

<button class="btn-icon variant-ghost-secondary pointer-events-auto"
    on:click={() => {
        notifications.show({title: 'Save', message: 'Saving graph...'});
    }}
	><Fa icon={faFloppyDisk} /></button
>
