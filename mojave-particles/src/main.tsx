import "framer-plugin/framer.css"
import ReactDOM from "react-dom/client"
import { App } from "./plugin.tsx"

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

// Render the plugin component
ReactDOM.createRoot(root).render(<App />)
