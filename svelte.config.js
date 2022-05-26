import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {},
    extensions: ['.svelte', ...mdsvexConfig.extensions],

    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            scss: {
                prependData: '@use "src/variables.scss" as *;'
            }
        }),
        mdsvex(mdsvexConfig)
    ],

    kit: {
        adapter: adapter(),

        // Override http methods in the Todo forms
        methodOverride: {
            allowed: ['PATCH', 'DELETE']
        },

        // inlineStyleThreshold: -1,

        vite: {
            resolve: {
                alias: {
                    $components: resolve('./src/components'),
                    $containers: resolve('./src/containers')
                    // 'node-fetch': 'isomorphic-fetch'
                }
            },

            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: '@use "src/variables.scss" as *;'
                    }
                }
            },

            server: {
                headers: {
                    // Needed to allow SharedArrayBuffer to squeak through on some browsers....
                    // REFERENCE https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
                    'Cross-Origin-Opener-Policy': 'same-origin',
                    'Cross-Origin-Embedder-Policy': 'require-corp'
                }
            },

            worker: {
                format: 'iife',
                rollupOptions: {
                    inlineDynamicImports: true,
                    treeshake: true
                }
            }
        }
    }
};

export default config;
