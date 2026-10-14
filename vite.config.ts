import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 保证在 GitHub Pages 任意子路径下均可正常加载静态资源
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 5173,
    host: true,
  },
});
