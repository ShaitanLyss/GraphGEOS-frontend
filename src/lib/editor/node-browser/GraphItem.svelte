<script lang="ts">
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { _ } from 'svelte-i18n';

	export let graphName: string | undefined = undefined;
	export let authorName: string | undefined = undefined;
</script>

<div class="card card-hover overflow-hidden variant-filled w-52">
	<header>
		<img
			src="https://source.unsplash.com/vjUokUWbFOs/400x175"
			class="bg-black/50 w-full aspect-[21/9]"
			alt="Post"
		/>
	</header>
	<div class="p-4 space-y-4">
		<h6 class="h6"><div class="placeholder w-24 h-2" /></h6>
		<!-- <h3 class="h3"><div class="placeholder w-32" /></h3> -->
		<h3 class="h3">{graphName}</h3>
	</div>

	<hr class="opacity-50" />
	<footer class="p-4 flex justify-start items-center space-x-4">
		<Fa icon={faUser} class="w-8" />
		<div class="flex-auto flex justify-between items-center">
			<h6 class="font-bold">{$_('card.graphItem.by_author', { values: { name: authorName } })}</h6>
			<small>On {new Date().toLocaleDateString()}</small>
		</div>
	</footer>
</div>
