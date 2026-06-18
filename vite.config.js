import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // three.js + postprocessing — heaviest, isolated for lazy-loading with HeroGridScan
          if (id.includes('node_modules/three') || id.includes('node_modules/postprocessing')) {
            return 'vendor-three';
          }
          // MUI + emotion
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-mui';
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Babel runtime helpers
          if (id.includes('node_modules/@babel')) {
            return 'vendor-babel';
          }
          // SweetAlert2
          if (id.includes('node_modules/sweetalert2')) {
            return 'vendor-sweetalert';
          }
          // axios + AOS + lucide-react + utility libs
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/aos') ||
            id.includes('node_modules/lucide-react') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge')
          ) {
            return 'vendor-utils';
          }
          // React core
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-helmet') ||
            id.includes('node_modules/react-intersection-observer')
          ) {
            return 'vendor-react';
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
