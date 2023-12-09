<script lang="ts">
	import Modals from '$lib/global/Modals.svelte';
	import Notifications from '$lib/global/Notifications.svelte';
	import Popups from '$lib/global/Popups.svelte';
	import MainView from '$lib/layout/MainView.svelte';
	import Localization from '$lib/localization/Localization.svelte';

	import '../app.pcss';
</script>

<svelte:head>
	<title>Geos UI</title>
</svelte:head>

<MainView>
	<svelte:fragment slot="sidebarLeft">
		<slot name="sidebarLeft" />
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="tabs">
		<slot name="tabs" />
	</svelte:fragment>
</MainView>

<Localization />
<Popups />
<Notifications />
<Modals />
