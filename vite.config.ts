import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd(), '');
	const webuiName = env.WEBUI_NAME || env.VITE_WEBUI_NAME || 'Open WebUI';

	return {
		plugins: [
			sveltekit(),
			// Replace branding placeholder in app.html at build time
			{
				name: 'html-transform-branding',
				transformIndexHtml(html: string) {
					return html.replace(/__WEBUI_TITLE__/g, webuiName);
				}
			},
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
			host: true, // listen on 0.0.0.0 so WebSocket works when accessing via 172.16.20.47
			allowedHosts: ['chathub.cardiosmart.ai', '172.16.20.47', 'localhost'],
			proxy: {
				// Proxy standard API calls and SSE streams
				'/api': {
					target: 'http://127.0.0.1:5190',
					changeOrigin: true,
					secure: false,
					ws: true, // Enable WebSocket proxying on the API route
					timeout: 0 // Prevent proxy from buffering/timing out long-lived SSE streams
				},
				'/ollama': {
					target: 'http://127.0.0.1:5190',
					changeOrigin: true,
					secure: false,
					timeout: 0 // SSE streams
				},
				// Proxy the dedicated Socket.io WebSocket connections (http target lets proxy handle upgrade)
				'/ws': {
					target: 'http://127.0.0.1:5190',
					ws: true,
					changeOrigin: true,
					secure: false
				},
				'/socket.io': {
					target: 'http://127.0.0.1:5190',
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
			'process.env.VITE_APP_API_BASE_URL': JSON.stringify('http://localhost:5190'),
			// Branding: expose WEBUI_NAME to frontend (from .env)
			'import.meta.env.VITE_WEBUI_NAME': JSON.stringify(webuiName)
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
