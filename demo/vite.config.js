import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  VitePWA({
    // This tells the plugin to use our custom service worker
    srcDir: 'public',
    filename: 'sw.js',
    strategies: 'injectManifest', 
    manifest: {
      name: 'Offline Hotels',
      short_name: 'OfflineHotels',
      description: 'A hotel booking app that works offline.',
      theme_color: '#007bff',
      background_color: '#ffffff',
      display: 'standalone', 
      start_url: '/',
      icons: [
        {
          src: 'images/icon-192.png', // Make sure these icons are in public/images
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'images/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
],
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Replace with your backend port
    },
    '/socket.io': {
      target: 'ws://localhost:5000',
      ws: true, // Important for WebSockets
    }
  },
})
