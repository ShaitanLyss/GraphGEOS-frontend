<script lang="ts">
	import { setCookie, getCookie, removeCookie } from 'typescript-cookie';
	import type { LayoutData } from '../$types';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
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
	import { isTauri } from '$utils/tauri';
	import { initials } from '$utils/string';
	let reload = false;
	let login = async () => {};
	// TODO : handle web app context
	const searchParams = new URLSearchParams(window.location.search);
	async function load() {
		const redirectUri = searchParams.get('redirect');
		const sessionToken = searchParams.get('sessionToken');

		if (sessionToken) {
			setCookie('sessionToken', sessionToken, { expires: 30, secure: true });
			reload = true;
		}
		if (!reload && getCookie('sessionToken')) {
			if (!session) {
				checkingForDeadBackend = true;
				if (!(await checkBackendHealth())) backendDed = true;
				checkingForDeadBackend = false;
			}
		}
		if (isTauri()) {
			if (session || reload) {
				window.location.href = redirectUri ? redirectUri : '/';
			}
		} else {
			if (reload || (session && redirectUri)) {
				window.location.href = redirectUri ? redirectUri : '/auth';
			}
		}

		let shell: { open: (arg0: string) => void };
		if (isTauri()) {
			// login = () => shell.open(getAuthenticationURL());
			({ shell } = await import('@tauri-apps/api'));
			const { listen } = await import('@tauri-apps/api/event');

			listen<string>('scheme-request-received', (event) => {
				const parsedRequest = parse_scheme_request(event.payload);
				if (parsedRequest === null || !parsedRequest.path.startsWith('auth-callback')) return;
				setCookie('sessionToken', parsedRequest.params.sessionToken, { expires: 30, secure: true });
				window.location.href = '/';
			});
		}
		login = async () => {
			if (isTauri())
				shell.open('http://localhost:8000/auth/login?callbackUri=geos-gui://auth-callback');
			else {
				const backendHost = 'localhost:8000';
				window.location.href = `http://${backendHost}/auth/login?callbackUri=${window.location.href}`;
			}
		};
	}

	onMount(async () => {
		await load();
		ready = true;
	});
</script>

<div class="h-full w-full flex justify-center items-center">
	{#if !ready || checkingForDeadBackend}
		<h1 class="h1">Loading...</h1>
	{:else if backendDed}
		<h1 class="h1">Backend is ded</h1>
	{:else if reload || !ready}
		<h1 class="h1">Loading...</h1>
	{:else}
		<div class="text-center space-y-6 card py-8 px-12 variant-soft-surface">
			<h1 class="h1 pb-2">Lunar Auth</h1>
			{#if session}
				<h2 class="h2">You are logged in as</h2>
				<div class="py-4">
					<Avatar
						src={session.user.image}
						initials={initials(session.user.name)}
						rounded="rounded-3xl"
						width="w-32 mx-auto"
					/>
				</div>
				<h2 class="h2">{session.user.name}</h2>
				<button
					class="btn bg-gradient-to-br variant-gradient-secondary-tertiary"
					on:click={() => {
						removeCookie('sessionToken');
						location.reload();
					}}>Logout</button
				>
			{:else}
				<h2 class="h2">You are not logged in</h2>
				<button class="btn bg-gradient-to-br variant-gradient-secondary-tertiary" on:click={login}
					>Login</button
				>
			{/if}
		</div>
	{/if}
</div>
