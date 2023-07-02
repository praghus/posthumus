import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import plainText from 'vite-plugin-plain-text'

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            stream: 'stream-browserify',
            util: 'rollup-plugin-node-polyfills/polyfills/util',
            zlib: 'rollup-plugin-node-polyfills/polyfills/zlib'
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true
                }),
                NodeModulesPolyfillPlugin()
            ]
        }
    },
    plugins: [plainText([/\.tmx$/], { namedExport: false })]
})
