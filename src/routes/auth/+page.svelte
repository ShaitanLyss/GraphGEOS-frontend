<script lang="ts">
	import { Avatar, getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import type { LayoutData } from '../$types';
	let backendDed = false;
	let checkingForDeadBackend = false;
	export let data: { session: Session | null } & PageData;
	const session = data.session;

	import { getCookie } from 'typescript-cookie';
	import { onMount, setContext } from 'svelte';
	import { notifications } from '@mantine/notifications';
	let ready = false;
	import { browser } from '$app/environment';
	import { parse_scheme_request } from './utils';
	import { checkBackendHealth } from '$utils/backend';
	import { isTauri } from '$utils/tauri';
	import { initials } from '$utils/string';
	import { _, sessionTokenStore } from '$lib/global';
	import { removeCookie, setCookie } from 'typescript-cookie';
	import Fa from 'svelte-fa';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
	import { env } from '$env/dynamic/public';
	import { getBackendAddress } from '$utils/config';
	import { fade, fly } from 'svelte/transition';
	import type { Session } from '$lib/backend-interaction';
	import type { PageData } from './$types';
	console.log('public dynamic env', env);
	let reload = false;
	let login: () => Promise<void>;
	// TODO : handle web app context
	const searchParams = new URLSearchParams(browser ? window.location.search : undefined);

	async function load() {
		if (!browser) return;

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
				shell.open(getBackendAddress(`/auth/login?callbackUri=geos-gui://auth-callback`));
			else {
				window.location.href = getBackendAddress(`/auth/login?callbackUri=${window.location.href}`);
			}
		};
	}

	const modalStore = getModalStore();
	const igg = localStorageStore('igg', '');
	const fakeLoginUsername = localStorageStore('fake-login-username', '');
	function fakeLogin() {
		modalStore.trigger({
			type: 'prompt',
			title: 'Enter your IGG',
			buttonTextSubmit: $_('button.confirm'),
			buttonTextCancel: $_('button.cancel'),
			valueAttr: {
				type: 'text',
				pattern: '[jlJL]\\d{3,12}',
				placeholder: 'IGG (ex: j12345678)',
				name: 'igg'
			},
			value: $igg,
			response(r) {
				if (!r) return;
				$igg = r;

				modalStore.trigger({
					type: 'prompt',
					title: 'Enter your username',
					buttonTextSubmit: $_('button.confirm'),
					buttonTextCancel: $_('button.cancel'),
					valueAttr: {
						type: 'text',
						placeholder: 'Username',
						name: 'username'
					},
					value: $fakeLoginUsername,
					response(r) {
						if (!r) return;
						$fakeLoginUsername = r;
						window.location.href = getBackendAddress(
							`/auth/fake-login?callbackUri=${window.location.href}&igg=${$igg}&username=${r}`
						);
					}
				});
			}
		});
	}

	onMount(async () => {
		await load();
		ready = true;
	});
	console.log('data', data);
</script>

<svelte:head>
	<title>Geos UI - Auth</title>
</svelte:head>
<div
	class="fixed inset-0 h-full w-full flex justify-center items-center"
	transition:fly={{ y: '100%', duration: 500 }}
>
	{#if !ready || checkingForDeadBackend}
		<h1 class="h1">Loading...</h1>
	{:else if backendDed}
		<h1 class="h1">Backend is ded</h1>
	{:else if reload || !ready}
		<h1 class="h1">Loading...</h1>
	{:else}
		<div class="text-center space-y-6 card py-8 px-24 variant-soft-surface">
			<h1 class="h1 pb-2">GEOS UI</h1>
			{#if session}
				<h2 class="h2">{$_('page.auth.message.logged-in-as')}</h2>
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
					}}>{$_('button.logout')}</button
				>
			{:else}
				<h2 class="h2">{$_('page.auth.message.not-logged-in')}</h2>
				<button class=" btn bg-gradient-to-br variant-gradient-secondary-tertiary" on:click={login}
					>{$_('button.login')}</button
				>
				{#if data.publicConfig.fake_login}
					<p
						class="mx-auto !mt-6 variant-filled-warning p-2 rounded-container-token"
						style="max-width: 30rem;"
					>
						{$_('page.auth.fake-login-explanation')}
					</p>
					<button
						class="btn bg-gradient-to-br variant-gradient-secondary-tertiary"
						on:click={fakeLogin}>Fake Login</button
					>
				{/if}
			{/if}
		</div>
	{/if}
</div>
