<script lang="ts">
	import { modalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import { notifications } from '@mantine/notifications';

	import type { NodeEditor } from '$rete/NodeEditor';
	import type { Writable } from 'svelte/store';

	let graphInput: HTMLInputElement;
	let formElement: HTMLFormElement;

	const formStore: Writable<Record<string, string>> = localStorageStore('uploadGraphForm', {});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const formValidity = formElement.checkValidity();

		formElement.querySelectorAll(':valid').forEach((element) => {
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

		// Submit the form data to the API endpoint
		fetch('http://localhost:8000/api/v1/graph', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((_) => {
				notifications.show({
					title: 'Success',
					message: 'Graph uploaded successfully.',
					color: 'green',
					variant: 'filled'
				});
				modalStore.close();
			})
			.catch((error) => {
				notifications.show({
					title: 'Error',
					message: 'There was an error uploading the graph.',
					color: 'red',
					variant: 'filled'
				});
				console.error(error);
			});
	};
</script>

{#if $modalStore}
	<div class="card">
		<header class="card-header text-2xl font-bold text-center">
			<h2>Upload Graph</h2>
			<!-- <button class="close" on:click={() => modalStore.set(null)}>×</button> -->
		</header>
		<section class="p-4 space-y-4">
			<form
				class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
				bind:this={formElement}
			>
				<label class="label">
					<span>Name</span><span class="text-red-500 ms-1">*</span>
					<input
						type="text"
						class="input"
						name="name"
						placeholder="Name"
						required
						bind:value={$formStore.name}
					/>
				</label>
				<!-- Description -->
				<label class="label">
					<span>Description</span>
					<input
						type="text"
						class="input"
						name="description"
						placeholder="Description"
						bind:value={$formStore.description}
					/>
				</label>

				<!-- Author -->
				<label class="label">
					<span>Author</span><span class="text-red-500 ms-1"> *</span>
					<input
						type="text"
						class="input"
						name="author"
						placeholder="Author"
						required
						bind:value={$formStore.author}
					/>
				</label>
				<input type="hidden" name="graph" bind:this={graphInput} />
			</form>
			<footer class="modal-footer flex justify-end space-x-2">
				<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}>Cancel</button
				>
				<button
					class="btn variant-filled"
					on:click={() => {
						handleSubmit(new Event('submit'));
					}}>Upload</button
				>
			</footer>
		</section>
	</div>
{/if}
