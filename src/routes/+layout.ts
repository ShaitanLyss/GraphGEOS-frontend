import type { LayoutLoad } from './$types';
import { loadLocale } from '$lib/localization/localization';

export const ssr = true;

export const load: LayoutLoad = async () => {
	await loadLocale();
};
