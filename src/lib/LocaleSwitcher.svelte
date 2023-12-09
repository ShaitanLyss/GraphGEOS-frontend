<script lang="ts">
	import { locale, locales, isLoading } from 'svelte-i18n';
	import { setCookie } from '$lib/global/cookies';

	$: selectedLocale = $locale?.split('-')[0];

	function setLocale() {
		setCookie('locale', selectedLocale, { forever: true });
		locale.set(selectedLocale);
	}
</script>

<!-- {"rounded-token h-7 cursor-pointer"} -->
<div>
	<select
		class="rounded-token h-7 cursor-pointer text-sm py-0 variant-ringed-surface w-16 pe-0"
		bind:value={selectedLocale}
		on:change={setLocale}
	>
		{#each $locales as locale}
			<option class="text-black" value={locale}>{locale}</option>
		{/each}
	</select>
</div>
