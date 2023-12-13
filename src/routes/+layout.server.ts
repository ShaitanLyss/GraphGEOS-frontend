import type { LayoutServerLoad } from './$types';
import { publicConfig } from '$lib/config';
export const load: LayoutServerLoad = () => {
	return {
		publicConfig
	};
};
