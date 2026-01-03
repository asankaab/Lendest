import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'LendBook - Track Your Lending',
        short_name: 'LendBook',
        description: 'A simple and intuitive app to track loans and borrowing between friends and family',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          // People list - cache for 24 hours (changes infrequently)
          {
            urlPattern: /\/rest\/v1\/people/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'people-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 3600 * 24 // 24 hours
              }
            }
          },
          // Transactions - network first, cache for 5 minutes
          {
            urlPattern: /\/rest\/v1\/transactions/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'transactions-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          },
          // Supabase auth - network first
          {
            urlPattern: /\/auth\/v1\/(token|user|session)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'auth-cache',
              networkTimeoutSeconds: 10
            }
          },
          // Images and avatars - cache first, 30 days
          {
            urlPattern: /^https:\/\/.+\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'charts': ['recharts'],
          'icons': ['lucide-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    target: 'esnext',
    cssCodeSplit: true,
    cssMinify: true
  }
})

