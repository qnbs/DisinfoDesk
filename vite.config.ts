import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = path.basename(process.cwd());
const ghPagesBase = `/${repoName}/`;

export default defineConfig(() => {
    return {
      base: ghPagesBase,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
            manualChunks: (id) => {
              if (!id.includes('node_modules')) return undefined;

              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('react-redux') || id.includes('@reduxjs')) {
                return 'vendor-react';
              }

              if (id.includes('@google/genai')) {
                return 'vendor-ai';
              }

              if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
                return 'vendor-charts';
              }

              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }

              return undefined;
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
