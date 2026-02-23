import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			sveltekit(),
			viteStaticCopy({
				targets: [
					{
						src: 'node_modules/onnxruntime-web/dist/*.jsep.*',
						dest: 'wasm'
					}
				]
			})
		],
		server: {
			port: 5191,
			allowedHosts: ['chathub.cardiosmart.ai'],
			proxy: {
				// Proxy standard API calls and SSE streams
				'/api': {
					target: 'http://127.0.0.1:5190',
					changeOrigin: true,
					secure: false,
					ws: true // Enable WebSocket proxying on the API route
				},
				'/ollama': {
					target: 'http://127.0.0.1:5190',
					changeOrigin: true,
					secure: false
				},
				// Proxy the dedicated Socket.io WebSocket connections
				'/ws': {
					target: 'ws://127.0.0.1:5190',
					ws: true,
					changeOrigin: true,
					secure: false
				},
				'/socket.io': {
					target: 'ws://127.0.0.1:5190',
					ws: true,
					changeOrigin: true,
					secure: false
				}
			}
		},

		define: {
			APP_VERSION: JSON.stringify(process.env.npm_package_version),
			APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build'),
			// Force the frontend to use the correct API base URL
			'process.env.VITE_APP_API_BASE_URL': JSON.stringify('http://localhost:5190')
		},
		build: {
			sourcemap: true
		},
		worker: {
			format: 'es'
		},
		esbuild: {
			pure: process.env.ENV === 'dev' ? [] : ['console.log', 'console.debug', 'console.error']
		}
	};
});
