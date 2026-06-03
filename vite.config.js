import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise warning limit slightly since three.js is inherently large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // three.js + postprocessing — largest chunk, isolated so it lazy-loads with HeroGridScan
          if (id.includes('node_modules/three') || id.includes('node_modules/postprocessing')) {
            return 'vendor-three';
          }
          // MUI — large but used across many components
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-mui';
          }
          // Framer Motion + React Spring — animation libs
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/@react-spring')) {
            return 'vendor-animation';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Firebase
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }
          // face-api.js — only loaded dynamically when webcam is enabled
          if (id.includes('node_modules/face-api')) {
            return 'vendor-faceapi';
          }
          // TensorFlow.js — pulled in by face-api, also dynamic-only
          if (id.includes('node_modules/@tensorflow') || id.includes('node_modules/tfjs')) {
            return 'vendor-tensorflow';
          }
          // Babel runtime helpers
          if (id.includes('node_modules/@babel')) {
            return 'vendor-babel';
          }
          // SweetAlert2
          if (id.includes('node_modules/sweetalert2')) {
            return 'vendor-sweetalert';
          }
          // Lottie / dotLottie
          if (id.includes('node_modules/@lottiefiles') || id.includes('node_modules/lottie')) {
            return 'vendor-lottie';
          }
          // Spline
          if (id.includes('node_modules/@splinetool') || id.includes('node_modules/spline')) {
            return 'vendor-spline';
          }
          // axios + gsap + AOS + typewriter + misc utility
          if (
            id.includes('node_modules/gsap') ||
            id.includes('node_modules/axios') ||
            id.includes('node_modules/aos') ||
            id.includes('node_modules/typewriter-effect') ||
            id.includes('node_modules/styled-components') ||
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
