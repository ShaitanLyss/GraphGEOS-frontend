import sveltePreprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'; // change l' adaptateur depuis adapter-auto vers adapter-static
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocessReact from 'svelte-preprocess-react/preprocessReact';
import delegateEvents from 'svelte-preprocess-delegate-events/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		preprocessReact({
			preprocess: vitePreprocess()
		}),
		sveltePreprocess({
			postcss: true,
			typescript: true
		}),
		delegateEvents()
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		csrf: {
			checkOrigin: false
		},
		alias: {
			$rete: 'src/rete',
			$houdini: './$houdini',
			'$custom-components': 'src/rete/customization/presets/classic/components',
			$utils: 'src/utils'
		}
	}
};

export default config;
