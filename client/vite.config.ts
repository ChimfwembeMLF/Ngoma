import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Keep proxy target in sync with api/.env PORT (default 4000; use 4001 if port conflict)
    proxy: {
      '/api': { target: 'http://localhost:4001', changeOrigin: true },
      '/documentation': { target: 'http://localhost:4001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4001', changeOrigin: true },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
