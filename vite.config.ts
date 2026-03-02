import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';


export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
      includePublic: true,
      logStats: true, 
      png: { quality: 70 },
      jpeg: { quality: 70 },
      jpg: { quality: 70 },
      webp: { lossless: true, quality: 80 },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    
    rollupOptions: {
      output: {
        manualChunks: undefined, 
      },
    },
  },
});