<script lang="ts">
	import { locale, locales } from 'svelte-i18n';
	
	// TODO: this is a hack to fix the locale for fr-FR
	if ($locale === 'fr-FR')
		$locale = 'fr';
	if ($locale = 'en-EN')
		$locale = 'en';
	// add a property for adding classes to the select
</script>

<!-- {"rounded-token h-7 cursor-pointer"} -->
<div>
	<select class="rounded-token h-7 cursor-pointer text-sm py-0 variant-ringed-surface w-16 pe-0" bind:value={$locale}>
		{#each $locales as locale}
			<option value={locale}>{locale}</option>
		{/each}
	</select>
</div>
