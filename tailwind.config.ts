import { skeleton } from '@skeletonlabs/tw-plugin';
import prosePlugin from '@tailwindcss/typography';
import formPlugin from '@tailwindcss/forms';
import { join } from 'path';
import type { Config } from 'tailwindcss';

/*
 Warning: this will cause an infinite call stack error if this file
or a config file are edited because they each depend on each other.
(I am not entirely sure this is the reason but it seems to be)
*/
// import { getConfig } from '@selenial/typed-config';

// const { themes } = getConfig({
// 	domain: 'Public',
// 	schema: {
// 		themes: {
// 			presets: '("crimson" | "gold-nouveau" | "hamlindigo" | "modern" | "rocket" | "sahara" | "seafoam" | "skeleton" | "vintage" | "wintry")[]',
// 			customs: 'string[]'
// 		}
// 	}
// }
// );

const themes = {
	presets: [
		'crimson',
		'gold-nouveau',
		'hamlindigo',
		'modern',
		'rocket',
		'sahara',
		'seafoam',
		'skeleton',
		'vintage',
		'wintry'
	]
};

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts, jsx, tsx}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],

	theme: {
		extend: {}
	},
	compilerOptions: {
		baseUrl: '.',
		paths: {
			'$rete/*': ['src/rete/*']
		}
	},
	include: ['src/**/*'],
	plugins: [
		formPlugin,
		skeleton({
			themes: {
				preset: themes.presets.map((theme) => ({ name: theme, enhancements: true }))
			}
		}),
		prosePlugin
	]
} satisfies Config;

module.exports = config;
