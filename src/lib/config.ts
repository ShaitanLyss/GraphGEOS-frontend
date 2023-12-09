import { getConfig } from '@selenial/typed-config';

export const config = await getConfig({
	schema: {
		app: {
			title: 'string'
		}
	}
});
