# 🎯 Critical Framer Plugin Requirements (DON'T FORGET!)

## ❌ **COMMON MISTAKES I ALWAYS MAKE**

### **1. Plugin ID Requirements**
- ❌ **WRONG**: `"id": "mojave-particles"` (15 characters)
- ❌ **WRONG**: `"id": "mojave"` (6 characters but not hexadecimal)
- ✅ **CORRECT**: `"id": "a1b2c3"` (6-character hexadecimal string)

**Rule**: Framer requires plugin IDs to be **exactly 6 characters** and **hexadecimal format** (0-9, a-f).

### **2. Plugin Structure Requirements**
- ❌ **WRONG**: Trying to create a canvas component directly
- ❌ **WRONG**: Using `addPropertyControls` without proper setup
- ✅ **CORRECT**: Use `framer.showUI()` and `framer.createCodeFile()`

**Rule**: Framer plugins should create UI panels that add components to the canvas, not be canvas components themselves.

### **3. Server Requirements**
- ❌ **WRONG**: HTTP server (`http://localhost:5173`)
- ❌ **WRONG**: Different port (`https://localhost:5174` or `https://localhost:5175`)
- ✅ **CORRECT**: HTTPS server (`https://localhost:5173`) - port 5173 is required
- ✅ **REQUIRED**: `vite-plugin-mkcert` for SSL certificates

**Rule**: Framer requires HTTPS for plugin development.

### **4. Directory Requirements**
- ❌ **WRONG**: Running `npm run dev` from `/particles` directory
- ✅ **CORRECT**: Running `npm run dev` from `/particles/mojave-particles` directory
- ✅ **REQUIRED**: `package.json` must exist in the plugin directory

**Rule**: Always ensure you're in the correct plugin directory with `package.json`.

## 🔧 **CORRECT PLUGIN STRUCTURE**

### **framer.json (CRITICAL)**
```json
{
  "id": "a1b2c3",           // ← 6-char hex string
  "name": "Mojave Particles Pro",
  "description": "Professional particle system",
  "version": "1.2.0",
  "author": "Mojave Studio LLC",
  "modes": ["canvas"],
  "icon": "/icon.png",
  "main": "src/plugin.tsx"
}
```

### **plugin.tsx (CORRECT STRUCTURE)**
```typescript
import { framer } from "framer-plugin"
import React from "react"

// ← CRITICAL: Must use framer.showUI()
framer.showUI({
    position: "top right",
    width: 300,
    height: 200,
})

export function App() {
    const handleAddComponent = async () => {
        // ← CRITICAL: Use framer.createCodeFile() to add components
        const codeFile = await framer.createCodeFile("Component.tsx", `
            // Component code here
        `)
        
        const defaultExport = codeFile.exports.find((exp: any) => exp.isDefaultExport)
        
        if (defaultExport && 'insertURL' in defaultExport && defaultExport.insertURL) {
            await framer.addComponentInstance({
                url: defaultExport.insertURL,
                attributes: {} as any
            })
        }
    }

    return (
        <div>
            <button onClick={handleAddComponent}>Add Component</button>
        </div>
    )
}

export default App
```

### **main.tsx (CORRECT STRUCTURE)**
```typescript
import "framer-plugin/framer.css"  // ← CRITICAL: Must import framer CSS
import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./plugin.tsx"  // ← CRITICAL: Import App, not default

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
```

### **vite.config.ts (REQUIRED)**
```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import mkcert from "vite-plugin-mkcert"  // ← CRITICAL: For HTTPS
import framer from "vite-plugin-framer"   // ← CRITICAL: For Framer

export default defineConfig({
  plugins: [react(), mkcert(), framer()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: true,  // ← CRITICAL: Must be HTTPS
    cors: true
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['framer-plugin']
  }
})
```

## 🚨 **TROUBLESHOOTING CHECKLIST**

### **Before Starting Development:**
- [ ] ✅ In correct plugin directory (`mojave-particles`)
- [ ] ✅ `package.json` exists in plugin directory
- [ ] ✅ `framer.json` has 6-char hex ID
- [ ] ✅ All dependencies installed (`npm install --legacy-peer-deps`)
- [ ] ✅ `vite.config.ts` has HTTPS enabled
- [ ] ✅ Developer Tools enabled in Framer
- [ ] ✅ Ad-blocker allow-listed framer.com

### **If Plugin Won't Load:**
1. **Check framer.json ID**: Must be 6-char hex string
2. **Check server**: Must be HTTPS (`https://localhost:5173`)
3. **Check directory**: Must be in plugin directory
4. **Check imports**: Must import `framer-plugin/framer.css`
5. **Check structure**: Must use `framer.showUI()`

### **If Server Won't Start:**
```bash
# 1. Check if port 5173 is in use (required for Framer)
lsof -ti:5173
kill -9 $(lsof -ti:5173)

# 2. Clear cache
rm -rf .vite && rm -rf node_modules/.vite

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 4. Restart server (must use port 5173)
npm run dev
```

## 📱 **LOADING IN FRAMER**

### **Correct Process:**
1. **Open Framer**
2. **Go to Plugins** → **Developer Tools** (enable if not already)
3. **Click "Open Development Plugin"**
4. **Enter URL**: `https://localhost:5173`
5. **Click "Load"**

### **Expected Behavior:**
- ✅ Plugin loads without "Failed to load" error
- ✅ Plugin UI panel appears in Framer
- ✅ No framer.json ID errors
- ✅ No "Unable to connect" errors

## 🔄 **DEVELOPMENT WORKFLOW**

### **Start Development:**
```bash
cd mojave-particles
npm run dev
```

### **Make Changes:**
- Edit files in `src/`
- Changes auto-reload in Framer
- Check browser console for errors

### **Test Plugin:**
- Load in Framer using Developer Tools
- Test all functionality
- Check for console errors

## 🎯 **KEY REMINDERS**

### **ALWAYS REMEMBER:**
1. **Plugin ID**: 6-character hexadecimal string
2. **HTTPS**: Server must use HTTPS, not HTTP
3. **Port 5173**: Server must run on port 5173 (required for Framer)
4. **Directory**: Must be in plugin directory with package.json
4. **Structure**: Use `framer.showUI()`, not direct canvas components
5. **Imports**: Must import `framer-plugin/framer.css`
6. **Developer Tools**: Must be enabled in Framer

### **NEVER FORGET:**
- Plugin IDs are NOT just any 6 characters - they must be hexadecimal
- Framer plugins create UI panels that add components, not components themselves
- HTTPS is required, not optional
- Always check you're in the correct directory

---

**This documentation should prevent the same mistakes from happening again!** 🎉 