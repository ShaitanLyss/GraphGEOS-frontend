<script lang="ts">
	import { EditorSwitcher } from '$lib/editor';
	import { setContext } from '$lib/global';
	import { writable } from 'svelte/store';
	import type { GeosDataContext } from '$lib/geos';
	import type { PageData } from './$types';
</script>

<EditorSwitcher />
