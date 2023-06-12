import * as path from 'path';
import getSkeletonPlugins from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'
import prosePlugin from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config}*/
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts, jsx, tsx}',
		path.join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],

	theme: {
		extend: {}
	},

	plugins: [...getSkeletonPlugins(), prosePlugin]
};

module.exports = config;
