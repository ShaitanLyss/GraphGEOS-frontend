<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Notifications } from '@mantine/notifications';
	import { PUBLIC_AUTH0_CLIENT_ID, PUBLIC_AUTH0_DOMAIN } from '$env/static/public';
  
	let ready = false;
  import { browser } from '$app/environment';
  let login = () => {};
  
  async function load() {
    const { shell } = await import('@tauri-apps/api');
    login = () => shell.open(getAuthenticationURL());
  }
  if (browser) {
    // client-only code here
    load();
  }
	
	onMount(() => {
		ready = true;
	});

	function getAuthenticationURL() {
		return (
			'https://' +
			PUBLIC_AUTH0_DOMAIN +
			'/authorize?' +
			'scope=openid profile offline_access&' +
			'response_type=code&' +
			'client_id=' +
			PUBLIC_AUTH0_CLIENT_ID +
			'&' +
			'redirect_uri=' +
			'geos-gui://auth/callback'
		);
	}
</script>

<h1 class="h1">Tauri Auth</h1>
<button class="button variant-filled-primary" on:click={login}>Login</button>
