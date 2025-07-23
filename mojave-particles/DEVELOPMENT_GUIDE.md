# 🚀 Development Guide - Mojave Particles Pro

Complete guide for setting up and developing the Mojave Particles Framer plugin locally.

## 🎯 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Framer** (latest version)
- **Git**

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## 🔧 Development Workflow

### Standard Framer Plugin Development

This guide follows the official Framer plugin development workflow.

#### Start Development Server
```bash
npm run dev
```

#### Manual Server Management
```bash
# Check server status
lsof -i :5173  # Development server

# Stop servers manually
pkill -f "vite"
```

### Server URLs

#### Development Server
- **URL:** `https://localhost:5173`
- **Purpose:** Local development and Framer plugin testing
- **Status:** ✅ Running when `npm run dev` is active

## 📱 Framer Integration (Standard Workflow)

### 1. Enable Developer Tools
1. Open Framer
2. Go to **Plugins** → **Developer Tools**
3. Enable **Developer Tools** if not already enabled

### 2. Load Plugin in Framer
1. With your development server running (`npm run dev`)
2. In Framer, go to **Plugins** → **Open Development Plugin**
3. Enter URL: `https://localhost:5173`
4. Click **"Load"**

### 3. Development Workflow
- **Make changes** to your plugin code
- **Save files** - Framer will automatically reload
- **Test changes** in real-time
- **Stop server** with Ctrl+C when done

## 🎯 Critical Framer Plugin Requirements

### ❌ **COMMON MISTAKES TO AVOID**

#### **1. Plugin ID Requirements**
- ❌ **WRONG**: `"id": "mojave-particles"` (15 characters)
- ❌ **WRONG**: `"id": "mojave"` (6 characters but not hexadecimal)
- ✅ **CORRECT**: `"id": "a1b2c3"` (6-character hexadecimal string)

**Rule**: Framer requires plugin IDs to be **exactly 6 characters** and **hexadecimal format** (0-9, a-f).

#### **2. Plugin Structure Requirements**
- ❌ **WRONG**: Trying to create a canvas component directly
- ❌ **WRONG**: Using `addPropertyControls` without proper setup
- ✅ **CORRECT**: Use `framer.showUI()` and `framer.createCodeFile()`

**Rule**: Framer plugins should create UI panels that add components to the canvas, not be canvas components themselves.

#### **3. Server Requirements**
- ❌ **WRONG**: HTTP server (`http://localhost:5173`)
- ✅ **CORRECT**: HTTPS server (`https://localhost:5173`)
- ✅ **REQUIRED**: `vite-plugin-mkcert` for SSL certificates

**Rule**: Framer requires HTTPS for plugin development.

#### **4. Directory Requirements**
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

## 🛠️ Troubleshooting

### Common Issues

#### "Permission denied" when running scripts
```bash
chmod +x start-servers.sh stop-servers.sh
```

#### Ports already in use
```bash
pkill -f "vite"
# Then run:
npm run dev
```

#### Plugin won't load in Framer
1. **Check server is running**: Should see Vite output in terminal
2. **Verify URL**: Use `https://localhost:5173` (not `http`)
3. **Accept SSL certificate**: Click "Advanced" → "Proceed to localhost"
4. **Enable Developer Tools**: In Framer → Plugins → Developer Tools
5. **Check ad-blockers**: Some browsers block localhost access

#### Dependencies missing
```bash
npm install --legacy-peer-deps
```

## 📦 Build Commands

### Development
```bash
npm run dev          # Start development server
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
```

### Production
```bash
npm run build        # Build for production
npm run pack         # Pack for Framer distribution
npm run clean        # Clean build artifacts
```

## 🎨 Development Features

### Live Preview
- Real-time particle preview in plugin window
- Instant feedback on configuration changes
- Professional particle system simulation

### Hot Reload
- Automatic reload on file changes
- Preserved state during development
- Fast iteration cycle

### TypeScript Support
- Full type safety for all configurations
- IntelliSense support in your IDE
- Compile-time error checking

## 🔍 Code Quality

### ESLint Configuration
- TypeScript-aware linting rules
- React-specific best practices
- Consistent code formatting

### Type Checking
- Strict TypeScript configuration
- Comprehensive type definitions
- Build-time error detection

## 📝 Development Best Practices

### File Organization
- Keep components in `src/` directory
- Use TypeScript for all new files
- Follow React functional component patterns

### State Management
- Use React hooks for local state
- Keep configuration objects clean
- Implement proper cleanup in useEffect

### Performance
- Optimize canvas rendering
- Implement proper memory management
- Use React.memo for expensive components

---

**Ready to develop?** Start with `npm run dev` and load the plugin in Framer! 