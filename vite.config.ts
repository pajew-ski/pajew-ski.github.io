import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The heavy chat widget (Vue + highlight.js + n8n design system) is loaded
    // through a dynamic import, so it splits into its own chunk automatically
    // and stays off the critical path. Keep the framework core in stable vendor
    // chunks so long-term caching survives content-only redeploys.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
