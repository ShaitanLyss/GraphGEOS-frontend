<script lang="ts">
	import type { ButtonControl } from './button';

	export let data: ButtonControl;
</script>

<button
	class="btn variant-filled"
	on:pointerdown|stopPropagation={() => null}
	on:click={data.onClick}
>
	{data.label}
</button>
