<script lang="ts">
	import { capitalizeWords, capitalize } from '$utils';
	import { _, setCookie } from '$lib/global';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Fa } from 'svelte-fa';
	import { faFile, faFileAlt, faFolder } from '@fortawesome/free-regular-svg-icons';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$houdini';
	import { page, navigating } from '$app/stores';
	import { goto as base_goto, invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { importPublicKey, encryptData } from '$utils/crypto';

	export let host = $page.params.host;
	export let user = $page.params.user;
	export let path = '/' + $page.params.path;
	$: if ($page.params.path !== undefined) path = '/' + $page.params.path;
	$: if (path) searchQuery = '';
	export let hrefRoute = '/remote-explorer/';
	export let isLoading = false;
	$: if (navigating) isLoading = $navigating !== null;
	export let goto: (url: string) => Promise<void> = base_goto;

	const dispatch = createEventDispatcher<{
		fileselect: {
			file: {
				name: string;
				path: string;
			};
		};
	}>();
	// $: console.log('page change', $page);
	// $: console.log('path', path);
	export let data: PageData;
	let remoteExplorerData: PageData['remoteExplorerData'];
	$: if (data) {
		remoteExplorerData = data.remoteExplorerData;
	}
	$: console.log('remoteExplorerData', data.remoteExplorerData);
	// Identifying path crumbs
	let pathCrumbs: { label: string; path: string }[] = [];
	$: {
		let res: typeof pathCrumbs = [{ label: '', path: '' }];
		let crumbPath = '';
		for (const crumb of path.split('/')) {
			if (crumb) {
				crumbPath += crumb + '/';
				res.push({
					label: crumb,
					path: crumbPath
				});
			}
		}
		pathCrumbs = res;
	}
	$: console.log('path', path);
	const modalStore = getModalStore();
	$: console.log('pathCrumbs', pathCrumbs);

	export let files: { name: string; path: string; isDir: boolean }[] = [];
	let searchQuery = '';
	console.log('public', data.publicKey);
	function arrayBufferToBase64(buffer: ArrayBuffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}
	$: if (remoteExplorerData && remoteExplorerData.data) {
		files = remoteExplorerData.data.remoteExplorer.files
			.filter(
				({ path, name }) =>
					!name.startsWith('.') &&
					(path.startsWith('/work') || path.startsWith('/appli')) &&
					(searchQuery == '' || name.toLowerCase().includes(searchQuery.toLowerCase()))
			)
			.toSorted((a, b) => a.name.localeCompare(b.name))
			.map((f) => {
				return {
					name: f.name,
					path: f.path.at(-1) !== '/' && f.isDir ? f.path + '/' : f.path,
					isDir: f.isDir
				};
			});
		if (path !== '/') {
			console.log('path', path);
			files.unshift({
				name: '..',
				path: (/^(.*?\/?)[^\/]+\/?$/gm.exec(path) as RegExpExecArray)[1],
				isDir: true
			});
		}
	}

	function triggerRemoteAuthModal() {
		let changeUrl = false;

		// User modal prompt
		modalStore.trigger({
			type: 'prompt',
			title: $_('remote-explorer.auth-modal.user.title'),
			value: user !== '__missing_user__' ? user : '',
			valueAttr: {
				required: true,
				placeholder: $_('remote-explorer.auth-modal.user.placeholder'),
				name: 'linux-user'
			},
			response(r) {
				if (typeof r === 'string' && r !== user) {
					user = r;
					changeUrl = true;
				}
			},
			buttonTextCancel: capitalize($_('button.cancel')),
			buttonTextConfirm: capitalize($_('button.confirm')),
			buttonTextSubmit: capitalize($_('button.confirm'))
		});

		// Password modal prompt
		modalStore.trigger({
			type: 'prompt',
			title: $_('remote-explorer.auth-modal.password.title'),
			valueAttr: { required: true, name: 'linux-password', autocomplete: 'off', type: 'password' },
			async response(r: string | false) {
				if (typeof r === 'string') {
					const vector = crypto.getRandomValues(new Uint8Array(16));
					const publicKey = await importPublicKey(data.publicKey);
					console.log('publicKey', publicKey);

					const encrypted_linux_password = arrayBufferToBase64(
						await encryptData(vector, publicKey, r)
					);
					console.log(encrypted_linux_password);
					await fetch('/remote-explorer/password', {
						method: 'POST',
						body: JSON.stringify({ encrypted_linux_password })
					});
					goto(hrefRoute + user + '/' + host + path);
					// invalidateAll();
				}
			},
			buttonTextCancel: capitalize($_('button.cancel')),
			buttonTextConfirm: capitalize($_('button.confirm')),
			buttonTextSubmit: capitalize($_('button.confirm'))
		});
	}

	function handleFolderHrefClick(params: { e: MouseEvent; path: string }) {
		const e = params.e;
		e.preventDefault();
		const target = e.target as HTMLAnchorElement;
		const href = target.getAttribute('href');
		if (href) {
			path = params.path === '' ? '/' : params.path;
			goto(href);
		}
	}
</script>

<div class="card flex flex-col md:w-4/5 lg:w-2/3 mx-auto h-1/3 overflow-hidden">
	<div class="card-header">
		<div class="flex justify-between mb-4">
			<h3 class="h3">{capitalize($_('remote-explorer.title'))}</h3>
			<button
				class="btn variant-filled-surface flex items-center gap-2"
				on:click={() => triggerRemoteAuthModal()}
			>
				{user !== '__missing_user__' ? user : $_('remote-explorer.auth-btn.label.connect')}
				<Fa icon={faUser} />
			</button>
		</div>
		<nav class="div flex text-center justify-between align-middle items-center gap-2 w-full">
			<div class="flex gap-2">
				<input
					type="text"
					name="host"
					class="input w-24"
					placeholder="host"
					bind:value={host}
					on:change={(e) => goto(hrefRoute + user + '/' + host + path)}
				/>
				<!-- <span class="p-2">:</span> -->
				<ol class="breadcrumb">
					{#each pathCrumbs as crumb, i (crumb.path)}
						{#if i < pathCrumbs.length - 1}
							<li class="crumb">
								<a
									class="anchor"
									href={`${hrefRoute}${user}/${host}/${crumb.path}`}
									on:click={(e) => handleFolderHrefClick({ e, path: crumb.path })}
									>{crumb.label + '/'}</a
								>
							</li>
							<!-- <li class="crumb-separator" aria-hidden>/</li> -->
						{:else}
							<li class="crumb">{crumb.label + (crumb.label === '' ? '/' : '')}</li>
						{/if}
					{/each}
				</ol>
			</div>
			<input
				type="text"
				name="search"
				class="input w-48"
				placeholder={$_('remote-explorer.searchbar.placeholder')}
				bind:value={searchQuery}
			/>
		</nav>
	</div>
	<!-- <div transition:fade class="flex flex-col items-center gap-1">
		<input type="text" name="username" placeholder="Username" bind:value={$username} />
					<input type="password" name="password" placeholder="Password" bind:value={$password} />
	</div> -->

	<section class="overflow-y-auto p-4" style="height: 250vh;">
		{#if remoteExplorerData && !isLoading}
			{#if remoteExplorerData.data}
				<ul>
					{#each files as file}
						<li class="flex gap-1 items-center p-1">
							{#if file.isDir}
								<Fa icon={faFolder} class="w-4" /><a
									class="anchor"
									on:click={(e) => handleFolderHrefClick({ e, path: file.path })}
									href={`${hrefRoute}${user}/${host}${file.path}`}>{file.name}</a
								>
							{:else}
								<Fa icon={faFile} class="w-4" /><a
									class="anchor"
									on:click|preventDefault={() => dispatch('fileselect', { file })}
									href={`${hrefRoute}${user}/${host}${file.path}`}>{file.name}</a
								>
							{/if}
						</li>
					{/each}
				</ul>
			{:else if remoteExplorerData.errors}
				<h3 class="h3">Error</h3>
				<ul>
					{#each remoteExplorerData.errors as error}
						<li>{error.message}</li>
					{/each}
				</ul>
			{/if}
		{:else}
			<span class="italic px-4">Loading...</span>
		{/if}
	</section>
</div>
