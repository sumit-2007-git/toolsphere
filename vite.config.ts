import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets work on GitHub Pages, Netlify, Vercel, or local preview
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-pdf': ['pdf-lib'],
          'vendor-icons': ['lucide-react'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdf-lib', 'jszip', 'file-saver', 'qrcode']
  }
});
