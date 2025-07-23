import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import framer from "vite-plugin-framer"

// Production configuration for AWS deployment
export default defineConfig({
  plugins: [react(), framer()],
  
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          framer: ['framer-plugin'],
          icons: ['@phosphor-icons/react']
        },
        
        // Consistent file naming for CDN caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Optimize bundle size
    chunkSizeWarningLimit: 1000
  },
  
  define: {
    // Enable production mode
    'process.env.NODE_ENV': '"production"'
  },
  
  // Remove dev-only features for production
  server: undefined,
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['framer-plugin', 'react', 'react-dom', '@phosphor-icons/react']
  }
}) 