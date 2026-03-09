import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const repoName = path.basename(process.cwd());
const ghPagesBase = `/${repoName}/`;

/** Inject Content-Security-Policy meta tag in production builds only */
function cspPlugin(): Plugin {
  return {
    name: 'html-csp',
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html; // skip in dev
      const csp = [
        "default-src 'self'",
        "script-src 'self' https://aistudiocdn.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://cdn-icons-png.flaticon.com https://*.githubusercontent.com",
        "connect-src 'self' https://generativelanguage.googleapis.com https://aistudiocdn.com",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ].join('; ');
      return html.replace(
        '<!-- Security Headers -->',
        `<!-- Content Security Policy -->\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />\n\n    <!-- Security Headers -->`
      );
    },
  };
}

export default defineConfig(() => {
    return {
      base: ghPagesBase,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        cspPlugin(),
        tailwindcss(),
        react({
          babel: {
            plugins: [
              ['babel-plugin-react-compiler', { target: '19' }]
            ]
          }
        })
      ],
      build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 400,
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

              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
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
