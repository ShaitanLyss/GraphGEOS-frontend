import { getConfig } from '@selenial/typed-config';

export const config = getConfig({
	schema: {
		app: {
			title: 'string'
		}
	}
});

export const publicConfig = getConfig({
	domain: 'Public',
	schema: {
		themes: {
			presets:
				'("crimson" | "gold-nouveau" | "hamlindigo" | "modern" | "rocket" | "sahara" | "seafoam" | "skeleton" | "vintage" | "wintry")[]',
			customs: 'string[]'
		}
	}
});
