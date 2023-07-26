<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Notifications } from '@mantine/notifications';

	// const searchParams = $page.url.searchParams;
	let ready = false;

	onMount(() => {
		// const userSetupSuccess = searchParams.get('userSetupSuccess') !== 'false';
		// if (!userSetupSuccess && !$page.data.session) {
		// 	setTimeout(() => {
		// 		notifications.show({
		// 			title: 'Error',
		// 			message: 'There was an error setting up your account. Please try again.',
		// 			color: 'red',
		// 			autoClose: 5000
		// 		});
		// 	}, 0);
		// }

		// if (searchParams.has('userSetupSuccess') && $page.data.session) {
		// 	const userSetupSuccess = searchParams.get('userSetupSuccess') === 'true';
		// 	if (!userSetupSuccess) {
		// 		signOut();
		// 	}
		// }
		ready = true;
	});
</script>

<h1>SvelteKit Auth Example</h1>
{#if ready}
	<p>
		{#if $page.data.session}
			{#if $page.data.session.user?.image}
				<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
			{/if}
			<span class="signedInText">
				<small>Signed in as</small><br />
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</span>
			<button on:click={() => signOut()} class="button">Sign out</button>
		{:else}
			<div class="flex flex-col space-y-5">
				<span class="notSignedInText">You are not signed in</span>
				<button class="btn variant-filled" on:click={() => signIn('github')}
					>Sign In with GitHub</button
				>
				<button class="btn variant-filled" on:click={() => signIn('google')}
					>Sign In with Google</button
				>
			</div>
		{/if}
	</p>
{:else}
	<p>Checking session...</p>
{/if}
