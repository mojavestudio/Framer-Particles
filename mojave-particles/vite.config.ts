import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build'
  
  return {
    plugins: [
      react(), 
      framer(),
      // Only include mkcert for development (HTTPS for Framer)
      ...(isProduction ? [] : [mkcert()])
    ],
    
    server: isProduction ? undefined : {
      host: "0.0.0.0",
      port: 5173,
      https: true,
      cors: true
    },
    
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
      'process.env.NODE_ENV': isProduction ? '"production"' : '"development"'
    },
    
    optimizeDeps: {
      include: [
        'framer-plugin', 
        'react', 
        'react-dom', 
        '@phosphor-icons/react'
      ]
    }
  }
})
