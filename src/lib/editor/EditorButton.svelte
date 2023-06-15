<script lang="ts">
	import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let icon: IconDefinition;
    export let onClick: (event: Event) => void;
</script>

<button
	class="btn-icon variant-ghost-secondary pointer-events-auto"
	on:click={onClick}><Fa icon={icon} /></button
>
