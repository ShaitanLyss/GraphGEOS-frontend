import type { LayoutServerLoad } from './$types';
import { publicConfig } from '$lib/config';
export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	return {
		publicConfig,
		session
	};
};
