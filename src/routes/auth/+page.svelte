<script lang="ts">
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
	import { sessionTokenStore } from '../sessionTokenStore';
	import { removeCookie, setCookie } from 'typescript-cookie';
	import Fa from 'svelte-fa';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
	import { env } from '$env/dynamic/public';
	import { env as privateEnv } from '$env/dynamic/private';
	console.log('public dynamic env', env);
	console.log('private dynamic env', privateEnv);
	let reload = false;
	let login: () => Promise<void>;
	// TODO : handle web app context
	const searchParams = new URLSearchParams(window.location.search);
	async function load() {
		const redirectUri = searchParams.get('redirect');
		const sessionToken = searchParams.get('sessionToken');

		if (sessionToken) {
			sessionTokenStore.set(sessionToken);
			setCookie('sessionToken', sessionToken, { expires: 30 });
			reload = true;
		}
		if (!reload && $sessionTokenStore) {
			if (!session) {
				checkingForDeadBackend = true;
				if (!(await checkBackendHealth())) backendDed = true;
				checkingForDeadBackend = false;
			}
		}
		if (isTauri()) {
			if (session || reload) {
				console.log('tauri : redirecting');
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
				console.log('Received auth callback', parsedRequest);
				setCookie('sessionToken', parsedRequest.params.sessionToken, { expires: 30 });
				sessionTokenStore.set(parsedRequest.params.sessionToken);
				// window.location.href = '/';
			});
		}
		login = async () => {
			if (isTauri())
				shell.open(`${env.PUBLIC_BACKEND_ADDRESS}/auth/login?callbackUri=geos-gui://auth-callback`);
			else {
				window.location.href = `${env.PUBLIC_BACKEND_ADDRESS}/auth/login?callbackUri=${window.location.href}`;
			}
		};
	}

	onMount(async () => {
		await load();
		ready = true;
	});
</script>

<svelte:head>
	<title>Geos UI - Auth</title>
</svelte:head>
<div class="h-full w-full flex justify-center items-center">
	{#if !ready || checkingForDeadBackend}
		<h1 class="h1">Loading...</h1>
	{:else if backendDed}
		<h1 class="h1">Backend is ded</h1>
	{:else if reload || !ready}
		<h1 class="h1">Loading...</h1>
	{:else}
		<div class="text-center space-y-6 card py-8 px-12 variant-soft-surface">
			<h1 class="h1 pb-2">GEOS UI</h1>
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
				<div class="flex justify-center">
					<a
						href="/"
						class="text-surface-500-400-token text-center hover:text-surface-400-500-token"
					>
						<Fa icon={faHome} size="3x" />
					</a>
				</div>
				<button
					class="btn bg-gradient-to-br variant-gradient-secondary-tertiary"
					on:click={() => {
						sessionTokenStore.set('');
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
