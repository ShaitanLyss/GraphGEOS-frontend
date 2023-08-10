import { sveltekit } from '@sveltejs/kit/vite';
import houdini from 'houdini/vite';
import { defineConfig, type PluginOption } from 'vite';

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
		}
	]
	// test: {
	// 	include: ['src/**/*.{test,spec}.{js,ts}']
	// }
});
