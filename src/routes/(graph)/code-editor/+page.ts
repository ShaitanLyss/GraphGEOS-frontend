import { load_CodeEditorData } from '$houdini';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	return {
		...(await load_CodeEditorData({ event }))
	};
};
