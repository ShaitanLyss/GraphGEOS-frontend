import { sveltekit } from '@sveltejs/kit/vite';
import houdini from 'houdini/vite';
import { defineConfig, type PluginOption } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	build: {
		target: 'esnext'
	},

	plugins: [
		houdini(),
		sveltekit(),
		{
			name: 'replaceCompileTimeVariable',
			generateBundle() {
				this.emitFile({
					fileName: 'yoyo.js',
					type: 'asset',
					source: `export const COMPILE_TIME_VARIABLE = ${JSON.stringify(
						'Your compile-time value'
					)};`
				});
			}
		},
		purgeCss({
			safelist: {
				// any selectors that begin with "hljs-" will not be purged
				greedy: [/^hljs-/],
			},
		}),
	],
	server: {
		
		watch: {
			usePolling: true,
			interval: 10,
		}
	}
	// test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}']
	// }
});
