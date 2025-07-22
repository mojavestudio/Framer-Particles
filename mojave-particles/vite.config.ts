import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import framer from "vite-plugin-framer"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), framer()],
    build: {
        target: "ES2022",
        minify: "terser",
        lib: {
            entry: "particles.tsx",
            name: "MojaveParticles",
            fileName: "particles",
            formats: ["es"],
        },
        terserOptions: {
            compress: {
                dead_code: true,
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: true,
                pure_funcs: ['console.log'],
                passes: 2
            },
            mangle: {
                toplevel: true,
                properties: {
                    regex: /^_/
                }
            },
            format: {
                comments: /^!/
            }
        },
        rollupOptions: {
            external: ["react", "react-dom", "framer"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    framer: "framer",
                },
                banner: `/*! 🌟 Mojave Particles Pro v1.2.0 - © 2025 Mojave Studio LLC - All Rights Reserved - PROPRIETARY SOFTWARE - MOJAVE_PARTICLES_AUTHENTICATED_v1.2.0_2025 */`,
            },
        },
    },
    server: {
        https: {
            key: undefined,
            cert: undefined,
        },
        host: "0.0.0.0",
        port: 3000,
    },
})
