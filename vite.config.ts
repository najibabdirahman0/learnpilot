import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'YOUR_SENTRY_ORG', // TODO: Replace with your Sentry org
      project: 'YOUR_SENTRY_PROJECT', // TODO: Replace with your Sentry project
      authToken: process.env.SENTRY_AUTH_TOKEN, // Set in CI or .env
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
});
