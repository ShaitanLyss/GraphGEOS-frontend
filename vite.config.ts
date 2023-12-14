import { sveltekit } from '@sveltejs/kit/vite';
import houdini from 'houdini/vite';
import { defineConfig, type PluginOption } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	optimizeDeps: {
		exclude: ['monaco-editor']
	},
	build: {
		target: 'es2022',
		minify: true
	},

	plugins: [
		!process.env.VITEST ? houdini() : houdini({ watchSchema: undefined }),
		// houdini(),
		sveltekit(),
		purgeCss({
			safelist: {
				// any selectors that begin with "hljs-" will not be purged
				greedy: [/^hljs-/]
			}
		})
	],
	server: {
		watch: {
			usePolling: true,
			interval: 10
		}
	}
});
