<script lang="ts">
	import { graphql, type RemoteFileExplorer$result } from '$houdini';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { RemoteFileExplorerStore } from '$houdini';
	export let host = localStorageStore('remote-explorer-host', '');
	export let password = '';
	export let username = localStorageStore('remote-explorer-username', '');
	export let path = localStorageStore('remote-explorer-path', '/');
	export let files: RemoteFileExplorer$result['remoteExplorer']['files'] = [];
	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	async function go() {
		const { data } = await new RemoteFileExplorerStore().fetch({
			variables: {
				explorerInput: {
					host: $host,
					password,
					username: $username,
					path: $path
				}
			}
		});

		if (data) {
			console.log(data.remoteExplorer.files);
			files = data.remoteExplorer.files;
		}
	}
</script>

{#if mounted}
	<div class="flex flex-col items-center gap-4">
		<h3 class="h3">Remote File Explorer</h3>
		<div transition:fade class="flex flex-col items-center gap-1">
			<input type="text" name="host" placeholder="Server" bind:value={$host} />
			<input type="text" name="username" placeholder="Username" bind:value={$username} />
			<input type="password" name="password" placeholder="Password" bind:value={password} />
			<input type="text" name="path" placeholder="Path" bind:value={$path} />
		</div>
		<button type="button" class="btn variant-filled" on:click={(e) => go()}>Go</button>
		<h3 class="h3">Result</h3>
		<ul>
			{#each files as file}
				<li class="flex gap-1"><span>{file.name}</span>{file.isDir ? 'DIR' : ''}</li>
			{/each}
		</ul>
	</div>
{/if}
