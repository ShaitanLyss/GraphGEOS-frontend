import { browser } from '$app/environment';
import { getCookie } from '$lib/global/cookies';
import { locale, waitLocale } from 'svelte-i18n';

export async function loadLocale() {
	if (browser) {
		const lang = getCookie('locale') ?? window.navigator.language;
		locale.set(lang);
	}
	await waitLocale();
}
