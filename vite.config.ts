import path from 'path';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

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
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://*.githubusercontent.com",
        "connect-src 'self' https://generativelanguage.googleapis.com https://api.x.ai https://api.anthropic.com https://huggingface.co https://cdn-lfs.huggingface.co https://cdn-lfs-us-1.huggingface.co",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ].join('; ');
      return html.replace(
        '<!-- Security Headers -->',
        `<!-- Content Security Policy -->\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />\n    <meta http-equiv="X-Permitted-Cross-Domain-Policies" content="none" />\n\n    <!-- Security Headers -->`
      );
    },
  };
}

/** Copy extra static assets to dist/ */
function copyStaticAssetsPlugin(): Plugin {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const filesToCopy = [
        { src: '404.html', dest: '404.html' },
        { src: 'robots.txt', dest: 'robots.txt' },
        { src: 'sitemap.xml', dest: 'sitemap.xml' },
      ];
      filesToCopy.forEach(({ src, dest }) => {
        const srcPath = path.resolve(__dirname, src);
        const destPath = path.resolve(__dirname, 'dist', dest);
        const destDir = path.dirname(destPath);
        if (fs.existsSync(srcPath)) {
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(srcPath, destPath);
          console.log(`✓ ${src} copied to dist/`);
        }
      });
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
        copyStaticAssetsPlugin(),
        tailwindcss(),
        react(),
        visualizer({
          filename: 'dist/bundle-stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
            navigateFallback: 'index.html',
            navigateFallbackDenylist: [/^\/api\//],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
              // Google Fonts stylesheets
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-stylesheets',
                  expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              // Google Fonts webfont files
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-webfonts',
                  expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              // Images
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images-cache',
                  expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 },
                  cacheableResponse: { statuses: [0, 200] },
                },
              },
              // AI API calls — never cache
              {
                urlPattern: /^https:\/\/(generativelanguage\.googleapis\.com|api\.x\.ai|api\.anthropic\.com)\/.*/i,
                handler: 'NetworkOnly',
                options: { cacheName: 'ai-api' },
              },
              // Hugging Face model files for Transformers.js local fallback — cache for offline use
              {
                urlPattern: /^https:\/\/(huggingface\.co|cdn-lfs\.huggingface\.co|cdn-lfs-us-1\.huggingface\.co)\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'transformers-models',
                  expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
                  cacheableResponse: { statuses: [0, 200] },
                  matchOptions: { ignoreSearch: true },
                },
              },
            ],
          },
          manifest: {
            short_name: 'DisinfoDesk',
            name: 'DisinfoDesk: Das Lexikon',
            description: 'Ein interaktives Kompendium moderner Mythen, Verschwörungstheorien und urbaner Legenden mit KI-gestützter Analyse.',
            start_url: './',
            scope: './',
            display: 'standalone',
            display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
            theme_color: '#020617',
            background_color: '#020617',
            orientation: 'any',
            id: 'disinfodesk-v3',
            dir: 'ltr',
            lang: 'de',
            categories: ['education', 'reference', 'news'],
            handle_links: 'preferred',
            prefer_related_applications: false,
            launch_handler: { client_mode: 'navigate-existing' },
            icons: [
              { src: 'public/icons/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
              { src: 'public/icons/icon-maskable.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'maskable' },
            ],
            screenshots: [
              {
                src: 'https://images.unsplash.com/photo-1614064641938-3e8401107d65?q=80&w=1280&auto=format&fit=crop',
                sizes: '1280x720', type: 'image/jpeg', form_factor: 'wide',
                label: 'Desktop Dashboard — Tactical Command Overview',
              },
              {
                src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=720&auto=format&fit=crop',
                sizes: '720x1280', type: 'image/jpeg', form_factor: 'narrow',
                label: 'Mobile Feed — On-the-Go Research',
              },
            ],
            shortcuts: [
              { name: 'Das Archiv', short_name: 'Archiv', description: 'Öffne die Theorien-Datenbank', url: './#/archive', icons: [{ src: 'public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
              { name: 'KI Chat — Dr. Veritas', short_name: 'Dr. Veritas', description: 'Skeptischer KI-Debunk-Chat', url: './#/chat', icons: [{ src: 'public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
              { name: 'Satire Generator', short_name: 'Satire', description: 'Didaktischer Kontrastmodus', url: './#/satire', icons: [{ src: 'public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
              { name: 'Dashboard', short_name: 'Dashboard', description: 'Tactical Command Overview', url: './', icons: [{ src: 'public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
            ],
            protocol_handlers: [{ protocol: 'web+disinfo', url: './#/archive/%s' }],
            share_target: {
              action: './#/editor', method: 'POST', enctype: 'multipart/form-data',
              params: { title: 'title', text: 'text', url: 'url' },
            },
            file_handlers: [{
              action: './#/editor',
              accept: { 'application/json': ['.json', '.theory'] },
              icons: [{ src: 'public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
              launch_type: 'single-client',
            }],
            related_applications: [],
            scope_extensions: [{ origin: 'https://qnbs.github.io' }],
          },
          devOptions: {
            enabled: true,
            type: 'module',
          },
        }),
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

              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('react-redux') || id.includes('@reduxjs') || id.includes('redux-persist') || id.includes('redux-undo') || id.includes('react-error-boundary') || id.includes('@remix-run') || id.includes('/redux/') || id.includes('redux-thunk') || id.includes('/scheduler/') || id.includes('/immer/') || id.includes('/reselect/') || id.includes('use-sync-external-store') || id.includes('es-toolkit')) {
                return 'vendor-react';
              }

              if (id.includes('@google/genai') || id.includes('dompurify') || id.includes('zod')) {
                return 'vendor-ai';
              }

              if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor') || id.includes('decimal.js-light') || id.includes('eventemitter3') || id.includes('tiny-invariant') || id.includes('clsx')) {
                return 'vendor-charts';
              }

              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('fflate') || id.includes('canvg') || id.includes('css-line-break')) {
                return 'vendor-pdf';
              }

              if (id.includes('@xenova/transformers') || id.includes('onnxruntime')) {
                return 'vendor-transformers';
              }

              // Let Rollup optimally co-locate remaining deps with their importers
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
