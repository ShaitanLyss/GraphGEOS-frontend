import { browser } from '$app/environment';
import { getCookie } from '$lib/global/cookies';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

// Setup loaders for all locales
const locales_files = import.meta.glob('$lib/../locales/*.json');
Object.entries(locales_files).forEach(([path, module]) => {
	const [locale] = (path.split('/').pop() as string).split('.');
	register(locale, () => module());
});

export const init_i18n = () => {
	init({
		fallbackLocale: defaultLocale,
		initialLocale: browser ? getCookie('locale') ?? window.navigator.language : defaultLocale
	});
};
