import path from "path"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        "name": "Swarasana",
        "short_name": "Swarasana",
        "description": "Platform Komunal Inklusif Berbasis AI untuk Ruang Budaya",
        "theme_color": "#FFFFFF",
        "background_color": "#015289",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "icons": [
          {
            "src": "/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
      },
    }),
  ],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
})