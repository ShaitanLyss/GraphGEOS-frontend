import { init_i18n } from './init_i18n';
import { browser } from '$app/environment';
import { getCookie } from '$lib/global/cookies';
import { locale, waitLocale } from 'svelte-i18n';
import Localization__SvelteComponent_ from '$lib/localization/Localization.svelte';

init_i18n();

export async function loadLocale() {
	if (browser) {
		const lang = getCookie('locale') ?? window.navigator.language;
		locale.set(lang);
	}
	await waitLocale();
}

export * from 'svelte-i18n';
export { Localization__SvelteComponent_ as Localization };
