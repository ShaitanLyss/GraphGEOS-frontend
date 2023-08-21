import * as path from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
import prosePlugin from '@tailwindcss/typography';
import formPlugin from '@tailwindcss/forms';
import { join } from 'path';
import type { Config } from 'tailwindcss';


const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts, jsx, tsx}',
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
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
	plugins: [formPlugin, skeleton({
		themes: {
			preset: [{ name: "skeleton", enhancements: true }, 
			{ name: "modern", enhancements: true }, { name: "gold-nouveau", enhancements: true }
		]
		}
	}), prosePlugin]
} satisfies Config ;

module.exports = config;
