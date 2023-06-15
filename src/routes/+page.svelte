<script>
	import EditorSwitcher from '$lib/EditorSwitcher.svelte';
	import { AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import '../rete/imports';
</script>

<AppShell>
	<!-- <svelte:fragment slot="sidebarLeft">Sidebar left</svelte:fragment> -->
	<EditorSwitcher />
</AppShell>
