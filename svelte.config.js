//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

import { resolve } from 'path';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					'@constants': resolve('./src/constants'),
					'@stores': resolve('./src/stores'),
					'@components': resolve('./src/components'),
					'@utils': resolve('./src/utils'),
					'@assets': resolve('./src/assets')
				}
			}
		},
		adapter: adapter({
			/* // default options are shown
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			precompress: false */
		}),
		prerender: {
			// This can be false if you're using a fallback (i.e. SPA mode)
			default: true
		}
	}
};

export default config;
