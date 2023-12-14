<script lang="ts">
	import { ListBox, ListBoxItem, localStorageStore } from '@skeletonlabs/skeleton';
	import { getPublicConfig, setCookie, setTheme } from '.';
	import { capitalize } from '$utils/string';
	import { browser } from '$app/environment';
	const publicConfig = getPublicConfig();

	// const themes = ['skeleton', 'modern', 'gold-nouveau'];
	const themes: string[] = getPublicConfig().themes.presets;
	const theme = localStorageStore('zz-theme', publicConfig.default_theme);
	$: if (browser && $theme !== undefined) {
		setTheme($theme);
	}
	let selectedTheme: string = $theme;
	$: if (selectedTheme) {
		$theme = selectedTheme;
		if (browser) setCookie('theme', $theme);
	}
</script>

<ul />

<ListBox>
	{#each themes as t}
		<ListBoxItem bind:group={selectedTheme} name={capitalize(t)} value={t}>
			{capitalize(t)}
		</ListBoxItem>
	{/each}
</ListBox>
