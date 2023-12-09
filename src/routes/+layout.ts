import type { LayoutLoad } from './$types';
import { loadLocale } from '$lib/global/localization';

export const ssr = true;

export const load: LayoutLoad = async () => {
	await loadLocale();
};
