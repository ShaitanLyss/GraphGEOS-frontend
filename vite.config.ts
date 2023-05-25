import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
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
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
