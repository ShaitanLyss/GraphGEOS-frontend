<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { capitalize, words } from '$utils/string';

	let selectedJobs: number[] = [];
	export let card = '';
	export let padding = 'py-8 px-12';
	export let variant = '';
</script>

<div class="h-full w-full flex flex-col justify-start items-center p-4">
	<div
		class="prose dark:prose-invert text-center card
        space-y-6
        {card} min-w-fit {padding} w-full {variant}"
	>
		<h1>GEOS</h1>
		<div class="text-start">
			<div>
				<h2>{capitalize($_('geos.dash.source'))}</h2>
				<select class="select">
					<option value="1">Source 1</option>
					<option value="2">Source 2</option>
					<option value="3">Source 3</option>
				</select>
			</div>
			<div>
				<h2>{capitalize($_('geos.dash.job_queue'))}</h2>
				<select class="select" multiple size="3">
					<option value="1">Job 1</option>
					<option value="2">Job 2</option>
					<option value="3">Job 3</option>
				</select>
				<!-- <ListBox multiple on:keypress={(event) => console.log(event)}>
				<ListBoxItem bind:group={selectedJobs} value="0" name="job">Job 1</ListBoxItem>
				<ListBoxItem bind:group={selectedJobs} value="1" name="job">Job 2</ListBoxItem>
				<ListBoxItem bind:group={selectedJobs} value="2" name="job">Job 3</ListBoxItem>
			</ListBox> -->
			</div>
		</div>
		<button class="btn variant-filled-surface mx-auto">{words($_('geos.dash.new_job.btn'))}</button>
	</div>
</div>
