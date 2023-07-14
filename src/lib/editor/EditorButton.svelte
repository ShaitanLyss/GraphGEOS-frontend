<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let icon: IconDefinition;
	export let active = false;
</script>

<button class="btn-icon {active ? "variant-ghost-success": "variant-ghost-secondary"} pointer-events-auto" on:*
	><Fa {icon} /></button
>
