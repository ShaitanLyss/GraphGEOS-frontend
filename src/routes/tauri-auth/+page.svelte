<script lang="ts">
	import { setCookie, getCookie } from 'svelte-cookie';
	import type { LayoutData } from '../$types';
	import { page } from '$app/stores';
	let moving = false;
	let backendDed = false;
	let checkingForDeadBackend = false;
	export let data: LayoutData;
	const session = data.session;

	import { onMount, setContext } from 'svelte';
	import { notifications } from '@mantine/notifications';

	let ready = false;
	import { browser } from '$app/environment';
	import { parse_scheme_request } from './utils';
	import { checkBackendHealth } from '$utils/backend';
	let login = async () => {};

	async function load() {
		if (browser && getCookie('sessionToken')) {
			if (!session)  {
				checkingForDeadBackend = true;
				if (!(await checkBackendHealth())) backendDed = true;
				checkingForDeadBackend = false;
			}
		}
		if (session) {
			window.location.href = '/';
			moving = true;
		} else {
			moving = false;
		}
		const { shell } = await import('@tauri-apps/api');
		const { listen } = await import('@tauri-apps/api/event');
		// login = () => shell.open(getAuthenticationURL());
		login = async () =>
			shell.open('http://localhost:8000/auth/login?callbackUri=geos-gui://auth-callback');

		listen<string>('scheme-request-received', (event) => {
			const parsedRequest = parse_scheme_request(event.payload);
			if (parsedRequest === null || !parsedRequest.path.startsWith('auth-callback')) return;
			setCookie('sessionToken', parsedRequest.params.sessionToken, 30, true);
			window.location.href = '/';
		});
	}
	if (browser) {
		// client-only code here
		load();
	}

	onMount(() => {
		ready = true;
	});
</script>

{#if !ready || checkingForDeadBackend}
<div class="h-full w-full flex justify-center items-center">
		<h1 class="h1">Loading...</h1>
	</div>
{:else if backendDed}
	<div class="h-full w-full flex justify-center items-center">
		<h1 class="h1">Backend is ded</h1>
	</div>
{:else if moving || !ready}
	<div class="h-full w-full flex justify-center items-center">
		<h1 class="h1">Loading...</h1>
	</div>
{:else}
	<h1 class="h1">Tauri Auth</h1>
	<button class="button variant-filled-primary" on:click={login}>Login</button>
{/if}
