import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Sobat Cabe — Metode Mas Udin',
        short_name: 'Sobat Cabe',
        description: 'Penjadwalan & perawatan cabai Ori 212 dengan metode Mas Udin, dari bedengan sampai panen.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1f3a2e',
        theme_color: '#1f3a2e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Tugas hari ini', url: '/', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Kalkulator', url: '/kalkulator', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] }
        ]
      },
      workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'] }
    })
  ]
});
