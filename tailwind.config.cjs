import * as path from 'path';
import getSkeletonPlugins from '@skeletonlabs/skeleton/tailwind/skeleton.cjs';
import prosePlugin from '@tailwindcss/typography';
import formPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config}*/
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts, jsx, tsx}',
		path.join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],

	theme: {
		extend: {}
	},

	plugins: [formPlugin, ...getSkeletonPlugins(), prosePlugin]
};

module.exports = config;
