<script lang="ts">
	import { getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import { notifications } from '@mantine/notifications';
	import { page } from '$app/stores';
	// import { env } from '$env/dynamic/public';
	import { getCookie } from 'typescript-cookie';
	import type { NodeEditor } from '$rete/NodeEditor';
	import type { Writable } from 'svelte/store';
	import { ErrorWNotif, _, getContext } from '$lib/global';
	import { capitalize, words } from '$utils/string';
	import { onMount } from 'svelte';
	import { getBackendAddress } from '$utils/config';
	import type { UploadGraphModalMeta } from './types';

	import {
		GetGraphStore,
		type SessionAndUser$result,
		UpdateGraphStore,
		UploadGraphModalCreateStore,
		GraphFromAuthorAndNameStore
	} from '$houdini';

	import GraphForm from '$lib/forms/GraphForm.svelte';
	import type { UUID } from 'crypto';
	import Fa from 'svelte-fa';
	import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

	const modalStore = getModalStore();

	let formElement: HTMLFormElement;

	// const session: SessionAndUser$result['session'] | undefined = $page.data.session;

	const session = getContext('session');

	const formStore: Writable<Record<string, string>> = localStorageStore('uploadGraphForm', {});
	const meta: UploadGraphModalMeta = $modalStore[0].meta;
	$: editor = meta.editor;
	$: editorName = editor.name;
	$: userId = session?.user.id as UUID;
	$: userName = session?.user.name as string;
	$: graphPromise = (async () => {
		const response = await new GraphFromAuthorAndNameStore().fetch({
			variables: { authorId: userId, graphName: editorName }
		});
		console.log(response);
		return response;
	})();
	console.log('upload graph : session : user ID', session?.user.id);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const showErrorNotif = () =>
			notifications.show({
				title: $_('notification.error.title'),
				message: $_('modal.graph_upload.failed.message'),
				color: 'red',
				variant: 'filled'
			});

		const formValidity = formElement.checkValidity();
		const graphExistsRes = (await graphPromise).data?.graph.graphWithAuthordAndNameExists;
		if (!graphExistsRes) {
			throw new ErrorWNotif('Error checking if graph exists');
		}
		formElement.querySelectorAll(':valid:not([type="checkbox"])').forEach((element) => {
			element.classList.remove('input-error');
			element.classList.add('input-success');
		});

		formElement.querySelectorAll(':invalid').forEach((element) => {
			element.classList.add('input-error');
		});

		if (!formValidity) {
			console.log('Form is invalid');

			return;
		}

		if (!editor) {
			showErrorNotif();
			console.error('No editor found in modal meta data.');

			return;
		}

		if (formElement === undefined) {
			showErrorNotif();
			console.error('No form element found.');

			return;
		}

		// Perform any validation or data manipulation here
		const formData = new FormData(formElement);
		const data: Record<string, unknown> = {};

		for (const [key, value] of formData) {
			data[key] = value;
		}

		// Submit the form data to the API endpoint

		try {
			let requestSuccess = true;
			if (graphExistsRes.exists === true) {
				if (!Object.prototype.hasOwnProperty.call(data, 'is_public')) {
					data['is_public'] = false;
				} else {
					data['is_public'] = data['is_public'] === 'on';
				}
				console.log();

				const response = await new UpdateGraphStore().mutate({
					updateGraphInput: {
						id: graphExistsRes.id as string,
						description: data.description as string,
						public: data['is_public'] as boolean,
						editorData: JSON.parse(data.data as string)
					}
				});
				console.log('update graph response', response);
				requestSuccess = response.errors === null;
			} else {
				if (!Object.prototype.hasOwnProperty.call(data, 'is_public')) {
					data['is_public'] = false;
				} else {
					data['is_public'] = data['is_public'] === 'on';
				}
				const createStore = new UploadGraphModalCreateStore();
				const gqlResponse = await createStore.mutate({
					graph: {
						editorData: JSON.parse(data.data as string),
						title: editorName,
						authorId: userId,
						public: data.is_public as boolean,
						description: data.description as string,
						authorName: session?.user.name
					}
				});
				console.log('create graph response', gqlResponse);
				const response = await fetch(
					getBackendAddress(`/api/v1/users/${$page.data.session?.user.id}/graphs/`),
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					}
				);
				if (gqlResponse.errors) {
					requestSuccess = false;
					console.log('Error creating graph', gqlResponse.errors);
				}
			}

			if (!requestSuccess) {
				showErrorNotif();

				return;
			}

			notifications.show({
				title: $_('notification.success.title'),
				message: $_('modal.graph_upload.success.message'),
				color: 'green',
				variant: 'filled'
			});
			modalStore.close();
		} catch (error) {
			showErrorNotif();
			console.error(error);
		}

		// Close the modal
		modalStore.close();
	};
</script>

{#if session}
	{#if $modalStore}
		<div class="card">
			<header class="card-header text-2xl font-bold text-center">
				<h2>{words($_('modal.title.graph.upload'))}</h2>
				<!-- <button class="close" on:click={() => modalStore.set(null)}>×</button> -->
			</header>
			<section class="p-4 space-y-4 transition-all">
				{#await graphPromise}
					<div class="w-32 placeholder placeholde animate-pulse" />
				{:then graph}
					{#if graph.data?.graph.graphWithAuthordAndNameExists.exists}
						<aside class="alert variant-filled-tertiary">
							<!-- Icon -->
							<Fa icon={faQuestionCircle} />
							<!-- Message -->
							<div class="alert-message">
								<p>{capitalize($_('modal.graph.already_exist.message'))}</p>
							</div>
						</aside>
					{/if}
					<GraphForm
						{editor}
						{userName}
						graph={graph.data?.graph.graphWithAuthordAndNameExists.graph}
						bind:formElement
					/>
				{:catch error}
					error
				{/await}
				<footer class="modal-footer flex justify-end space-x-2">
					<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}
						>{$_('button.cancel')}</button
					>
					{#await graphPromise}
						<div class="w-32 h-auto placeholder placeholde animate-pulse" />
					{:then graph}
						<button
							class="btn variant-filled"
							on:click={() => {
								handleSubmit(new Event('submit'));
							}}
							>{capitalize(
								graph.data?.graph.graphWithAuthordAndNameExists.exists === false
									? $_('button.upload')
									: $_('form.graph.button.update')
							)}</button
						>
					{:catch error}
						{error}
					{/await}
				</footer>
			</section>
		</div>
	{/if}
{:else}
	{$_('modal.graph.upload.you-must-be-logged-in')}
{/if}
