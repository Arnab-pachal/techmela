import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust this if deploying to a subdirectory
  server: {
    port: 5173,
    host:'0.0.0.0', // Customize the development server port
    open: true, // Automatically opens the browser
    proxy: {
      // Example API proxy configuration
      '/api': {
        target: 'https://techmelabackend.onrender.com', // Your backend server
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist', // Directory for production build
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster builds
  },
  resolve: {
    alias: {
      // Example: Create an alias for components
      '@components': '/src/components',
    },
  },
});
