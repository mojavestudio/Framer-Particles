import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(), framer()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: true,
    cors: true
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['framer-plugin']
  }
})
