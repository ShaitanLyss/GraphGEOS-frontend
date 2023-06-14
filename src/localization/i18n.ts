import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));

await init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator()
});
