import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import framer from "vite-plugin-framer"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), framer()],
    build: {
        target: "ES2022",
        lib: {
            entry: "particles.tsx",
            name: "MojaveParticles",
            fileName: "particles",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "framer"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    framer: "framer",
                },
            },
        },
    },
    server: {
        https: true,
        host: true,
    },
})
