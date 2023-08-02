import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

await init({
	fallbackLocale: 'en',
	initialLocale: 'en'
});

export {};