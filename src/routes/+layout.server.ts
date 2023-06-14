import { getLocaleFromNavigator, init } from "svelte-i18n";

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
});