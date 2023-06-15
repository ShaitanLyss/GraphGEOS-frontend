<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
</script>

{#if $modalStore}
	<div class="card">
		<header class="card-header text-2xl font-bold text-center">
			<h2>Upload Graph</h2>
			<!-- <button class="close" on:click={() => modalStore.set(null)}>×</button> -->
		</header>
		<section class="p-4 space-y-4">
			<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
				<label class="label">
					<span>Name</span>
					<input type="text" class="input" placeholder="Name" />
				</label>
				<!-- Author -->
				<label class="label">
					<span>Author</span>
					<input type="text" class="input" placeholder="Author" />
				</label>
			</form>
			<footer class="modal-footer flex justify-end space-x-2">
				<button class="btn variant-ghost-surface" on:click={() => modalStore.close()}>Cancel</button
				>
				<button
					class="btn variant-filled"
					on:click={() => {
						modalStore.close();
					}}>Upload</button
				>
			</footer>
		</section>
	</div>
{/if}
