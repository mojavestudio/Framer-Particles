# 🌟 Mojave Particles Pro

A professional-grade particle system plugin for Framer with advanced animations, physics, and interactive effects.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Framer account with Developer Tools enabled

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### Load in Framer
1. **Open Framer**
2. **Go to Plugins** → **Developer Tools** (enable if not already)
3. **Click "Open Development Plugin"**
4. **Enter URL**: `https://localhost:5173`
5. **Click "Load"**

## ✨ Features

### **🎨 Professional Interface Design**
- **Logical Organization**: Settings grouped into Canvas, Appearance, Properties, and Interactions sections
- **Enhanced Size Controls**: Support for particles up to 2000px with dual slider + number input
- **Professional Icons**: Consistent Phosphor icon system (LinkSimple, CursorClick, Ruler)
- **Smart Color Management**: Multi-color palette with random generation and visual color picker

### **⚙️ 50+ Customizable Properties**
- **Canvas Settings**: Dimensions, background color/opacity, border radius
- **Particle Appearance**: Amount, primary color, multi-color palette management
- **Particle Properties**: Advanced size (1-2000px) and opacity controls with type selection
- **Particle Connections**: Network line drawing with distance and opacity controls
- **Mouse Interactions**: Hover effects (grab, bubble, repulse, attract) with strength tuning
- **Interaction Distances**: Fine-grained control over all effect ranges and forces

### **8 Professional Presets**
- **Basic** - Clean, minimal particle field
- **Snow** - Gentle falling snowflakes with twinkle
- **Rainbow** - Colorful, vibrant particle system
- **Network** - Connected network visualization
- **Bubbles** - Floating bubble effect
- **Matrix** - Digital rain effect
- **Galaxy** - Cosmic star field with attraction
- **Neon** - Bright, energetic neon particles

### **Advanced Rendering**
- **Ultra-clean rendering** with device pixel ratio support
- **GPU acceleration** for smooth 60fps animations
- **No artifacts** or pixelation issues
- **Responsive design** that adapts to any container

## 🎨 Usage

### **Plugin Interface**
The plugin provides a comprehensive UI panel with:
- **Live Preview** - Real-time particle system preview
- **Property Controls** - All 50+ customization options
- **Preset Library** - 8 professional presets for instant effects
- **Create/Edit Modes** - Optimized workflow for different use cases

### **Adding Particles to Canvas**
1. **Load the plugin** in Framer (see Quick Start)
2. **Customize particles** using the property controls
3. **Click "Add Particles"** to create on canvas
4. **Adjust properties** in Framer's property panel

## 🔧 Development

### **Project Structure**
```
mojave-particles/
├── src/
│   ├── plugin.tsx          # Main plugin interface (2174 lines)
│   ├── main.tsx            # Entry point
│   ├── App.css             # Styles
│   └── vite-env.d.ts       # TypeScript declarations
├── public/                 # Static assets
├── framer.json            # Plugin configuration
├── vite.config.ts         # Build configuration
└── package.json           # Dependencies and scripts
```

### **Key Files**
- **`src/plugin.tsx`** - Complete plugin interface with all features
- **`framer.json`** - Plugin configuration (ID: `a1b2c3`)
- **`vite.config.ts`** - HTTPS development server setup
- **`FRAMER_PLUGIN_REQUIREMENTS.md`** - Critical requirements documentation

### **Available Scripts**
```bash
npm run dev          # Start development server (HTTPS)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚨 Troubleshooting

### **Common Issues**
- **"Failed to load"**: Check `FRAMER_PLUGIN_REQUIREMENTS.md`
- **Plugin ID errors**: Must be 6-character hexadecimal
- **HTTPS required**: Server must use HTTPS, not HTTP
- **Directory issues**: Must run from `mojave-particles` directory

### **Quick Fixes**
```bash
# Clear cache and restart
rm -rf .vite && npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check server status
lsof -i :5173
```

## 📚 Documentation

### **Essential Guides**
- **[FRAMER_PLUGIN_REQUIREMENTS.md](FRAMER_PLUGIN_REQUIREMENTS.md)** - Critical requirements (DON'T FORGET!)
- **[SERVER_SCRIPTS.md](SERVER_SCRIPTS.md)** - Server management scripts
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - AWS deployment guide

### **Development Workflow**
1. **Start development**: `npm run dev`
2. **Load in Framer**: Use Developer Tools
3. **Make changes**: Edit `src/plugin.tsx`
4. **Test**: Changes auto-reload in Framer
5. **Deploy**: Follow `DEPLOYMENT.md` guide

## 🔐 License

© 2025 Mojave Studio LLC - All Rights Reserved

This is proprietary software. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## 🌟 Support

- **Documentation**: See guides above
- **Issues**: GitHub Issues
- **Contact**: info@mojavestud.io

---

**Built with ❤️ for the Framer community by Mojave Studio**
# Test auto-deployment Tue Jul 22 15:42:46 PDT 2025
