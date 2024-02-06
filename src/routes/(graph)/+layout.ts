import { load_GraphEditorData } from '$houdini';
import { loadLocale } from '$lib/global/localization';
import type { LayoutLoad } from '../$types';

export const load: LayoutLoad = async (event) => {
	return {
		...(await load_GraphEditorData({ event }))
	};
};
