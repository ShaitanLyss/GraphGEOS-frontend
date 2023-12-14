// import { getConfig } from '@selenial/typed-config';
import nodeConfig from 'config';
const getConfig = ({ domain }: { domain?: string; schema: unknown }) => {
	return nodeConfig.util.toObject(nodeConfig.get(domain ?? 'App'));
};
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
