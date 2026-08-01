import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

function adsenseScriptPlugin(publisherId: string): Plugin {
  return {
    name: 'adsense-script-when-configured',
    transformIndexHtml(html) {
      if (publisherId) return html;
      return html.replace(
        /\s*<script\s+async\s+src="https:\/\/pagead\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=%VITE_ADSENSE_PUBLISHER_ID%"[\s\S]*?<\/script>/,
        '',
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [
    react(), 
    tailwindcss(),
    adsenseScriptPlugin(env.VITE_ADSENSE_PUBLISHER_ID ?? ''),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ngoma',
        short_name: 'Ngoma',
        description: 'African Music Platform',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4001', changeOrigin: true },
      '/documentation': { target: 'http://localhost:4001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4001', changeOrigin: true },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  };
});
