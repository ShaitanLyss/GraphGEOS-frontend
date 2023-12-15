<script lang="ts">
	import { Popup } from '$lib/layout';
	import type { Writable } from 'svelte/store';
	import type { GlobalPopupProps } from './popup';
	export let globalPopupProps: Writable<GlobalPopupProps>;
	export let target: string;
</script>

<Popup {target} classList="z-20" {...$globalPopupProps} />
