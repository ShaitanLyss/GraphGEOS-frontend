<script lang="ts">
	import { modalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import { notifications } from '@mantine/notifications';
	import { page } from '$app/stores';

	import type { NodeEditor } from '$rete/NodeEditor';
	import type { Writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';
	import { capitalize, words } from '$utils/string';

	let graphInput: HTMLInputElement;
	let formElement: HTMLFormElement;

	const formStore: Writable<Record<string, string>> = localStorageStore('uploadGraphForm', {});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const formValidity = formElement.checkValidity();

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

		const editor = $modalStore[0].meta.editor;

		if (!editor) {
			notifications.show({
				title: 'Error',
				message: 'There was an error uploading the graph.',
				color: 'red',
				variant: 'filled'
			});
			console.error('No editor found in modal meta data.');

			return;
		}
		graphInput.value = JSON.stringify(editor);

		// Perform any validation or data manipulation here
		const formData = new FormData(formElement);
		const data: Record<string, unknown> = {};

		for (const [key, value] of formData) {
			data[key] = value;
		}

		if (!Object.prototype.hasOwnProperty.call(data, 'is_public')) {
			data['is_public'] = false;
		}

		// Submit the form data to the API endpoint

		try {
			const response = await fetch(
				`http://localhost:8000/api/v1/users/${$page.data.session?.user.id}/graphs/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}
			);

			if (!response.ok) {
				const { detail } = await response.json();
				console.log(detail);

				notifications.show({
					title: 'Error',
					message: 'There was an error uploading the graph.',
					color: 'red',
					variant: 'filled'
				});

				return;
			}

			notifications.show({
				title: 'Success',
				message: 'Graph uploaded successfully.',
				color: 'green',
				variant: 'filled'
			});
			modalStore.close();
		} catch (error) {
			notifications.show({
				title: 'Error',
				message: 'There was an error uploading the graph.',
				color: 'red',
				variant: 'filled'
			});
			console.error(error);
		}

		// Close the modal
		modalStore.close();
	};
</script>

{#if $modalStore}
	<div class="card">
		<header class="card-header text-2xl font-bold text-center">
			<h2>{words($_('modal.title.graph.upload'))}</h2>
			<!-- <button class="close" on:click={() => modalStore.set(null)}>×</button> -->
		</header>
		<section class="p-4 space-y-4">
			<form
				class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
				bind:this={formElement}
			>
				<label class="label">
					<span>{capitalize($_('form.input.graph.name.title'))}</span><span class="text-red-500 ms-1">*</span>
					<input
						type="text"
						class="input"
						name="name"
						placeholder={words($_('form.input.graph.name_placeholder'))}
						required
						bind:value={$formStore.name}
					/>
				</label>
				<!-- Description -->
				<label class="label">
					<span>{$_('title.description')}</span>
					<input
						type="text"
						class="input"
						name="description"
						placeholder={$_('form.input.graph.description_placeholder')}
						bind:value={$formStore.description}
					/>
				</label>
				<label class="label align-middle">
					<span>{$_('form.input.make_public')}</span>
					<input
						type="checkbox"
						class="input w-6 h-6 ms-2 my-auto"
						name="is_public"
						bind:checked={$formStore.is_public}
					/>
				</label>

				<!-- Author -->
				<label class="label">
					<span>{$_('title.author')}</span><span class="text-red-500 ms-1"> *</span>
					<input
						type="text"
						class="input"
						name="author"
						placeholder="Author"
						required
						readonly
						value={$page.data.session?.user?.name}
					/>
				</label>
				<input type="hidden" name="data" bind:this={graphInput} />
			</form>
			<footer class="modal-footer flex justify-end space-x-2">
				<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}
					>{$_('button.cancel')}</button
				>
				<button
					class="btn variant-filled"
					on:click={() => {
						handleSubmit(new Event('submit'));
					}}>{$_('button.upload')}</button
				>
			</footer>
		</section>
	</div>
{/if}
