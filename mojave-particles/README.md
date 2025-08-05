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
4. **Enter URL**: `https://localhost:5173` (port 5173 required)
5. **Click "Load"**

## ✨ Features

### **🎨 Professional Interface Design**
- **Logical Organization**: Settings grouped into Canvas, Appearance, Properties, and Interactions sections
- **Enhanced Size Controls**: Support for particles up to 2000px with dual slider + number input
- **Professional Icons**: Consistent Phosphor icon system (LinkSimple, CursorClick, Ruler)
- **Smart Color Management**: Multi-color palette with random generation and visual color picker
- **Combined Effects**: Glow & Twinkle effects grouped in one intuitive section

### **⚙️ 60+ Customizable Properties**
- **Canvas Settings**: Dimensions, background color/opacity, border radius
- **Particle Appearance**: Amount, primary color, multi-color palette management
- **Particle Properties**: Advanced size (1-2000px) and opacity controls with type selection
- **Particle Connections**: Network line drawing with distance and opacity controls
- **Mouse Interactions**: Advanced hover effects (bubble, grab, attract, repulse) with proper mouse tracking
- **Physics Controls**: Gravity, reverse gravity, spin, vibration, and boundary behavior
- **Visual Effects**: Shape-aware glow effects and twinkle animations
- **Infinite Streams**: Natural continuous particle flows with varied speeds and no banding

### **9 Professional Presets**
- **Black Hole** - Clean, minimal cosmic particles
- **Snow** - Gentle falling snowflakes with natural physics
- **Rainbow** - Colorful, vibrant particle system with trails
- **Network** - Connected network visualization with thick white lines
- **Bubbles** - Floating bubble effect with glow
- **Lazer** - Red laser beam particles with glow and twinkle
- **Galaxy** - Cosmic star field with diamond particles
- **Neon** - Bright, energetic neon particles with glow
- **Lava Lamp** - Warm, flowing lava particles with reverse gravity

### **Advanced Rendering**
- **Shape-aware glow effects** - Glow matches particle shape (square, triangle, diamond, etc.)
- **Ultra-clean rendering** with device pixel ratio support
- **GPU acceleration** for smooth 60fps animations
- **No artifacts** or pixelation issues
- **Responsive design** that adapts to any container

## 🎨 Usage

### **Plugin Interface**
The plugin provides a comprehensive UI panel with:
- **Live Preview** - Real-time particle system preview
- **Property Controls** - All 60+ customization options
- **Preset Library** - 9 professional presets for instant effects
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
│   ├── plugin.tsx          # Main plugin interface (3057 lines)
│   ├── EnhancedParticleRenderer.tsx # Live preview component (709 lines)
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # TypeScript declarations
├── public/                 # Static assets
├── framer.json            # Plugin configuration
├── vite.config.ts         # Build configuration
└── package.json           # Dependencies and scripts
```

### **Key Files**
- **`src/plugin.tsx`** - Complete plugin interface with all features
- **`src/EnhancedParticleRenderer.tsx`** - Live preview with shape-aware effects
- **`framer.json`** - Plugin configuration (ID: `a1b2c3`)
- **`vite.config.ts`** - HTTPS development server setup
- **`FRAMER_PLUGIN_REQUIREMENTS.md`** - Critical requirements documentation

### **Available Scripts**
```bash
npm run dev      # Start development server (HTTPS on port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run pack     # Create plugin package
```

## 🎯 Recent Updates

### **v1.4.0 - Infinite Streams & Hover Interactions**
- **✅ Fixed Infinite Stream Logic** - Natural continuous particle flows without bands
- **✅ Enhanced Hover Interactions** - Bubble, grab, and attract effects with proper mouse tracking
- **✅ Natural Speed Variation** - Particles move at varied speeds (0.6x to 1.4x) for organic movement
- **✅ Eliminated Violent Motion** - Particles stay within canvas bounds, no more artifacts
- **✅ Unified Positioning System** - Consistent particle distribution for initial creation and boundary reset
- **✅ Improved Bubble Effects** - Particles grow naturally when hovering with bubble mode
- **✅ Better Boundary Handling** - Particles reset at edges with natural distribution

### **v1.3.0 - Enhanced Physics & Effects**
- **✅ Reverse Gravity Toggle** - Authentic lava lamp physics
- **✅ Shape-Aware Glow Effects** - Glow matches particle shape perfectly
- **✅ Improved Snow Physics** - Natural falling without bouncing
- **✅ Enhanced Network Preset** - Thick, visible connection lines
- **✅ Combined UI Sections** - Glow & Twinkle effects grouped together
- **✅ Removed Mouse Attraction** - Cleaner, more focused interactions
- **✅ Better Boundary Handling** - Particles exit frame naturally

### **v1.2.0 - Professional Presets**
- **✅ 9 Professional Presets** - From Black Hole to Lava Lamp
- **✅ Enhanced Network Visualization** - Dense, visible connections
- **✅ Improved Snow Effect** - Realistic falling physics
- **✅ Authentic Lava Lamp** - Reverse gravity for rising bubbles

## 📚 Documentation

- **`FRAMER_PLUGIN_REQUIREMENTS.md`** - Critical requirements and setup
- **`DEVELOPMENT_GUIDE.md`** - Development workflow and best practices
- **`FRAMER_PUBLISHING.md`** - Publishing to Framer marketplace
- **`FRAMER_MARKETPLACE_SUBMISSION.md`** - Submission guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

© 2025 Mojave Studio - mojavestud.io
Custom Automated Web Design Experts

Built with ❤️ for the Framer community
