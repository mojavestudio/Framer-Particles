# 🌟 Mojave Particles Pro

A professional-grade particle system plugin for Framer with advanced animations, physics, and interactive effects.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Pack for Framer
npm run pack
```

### Features
- **50+ Controls** for complete particle customization
- **8 Professional Presets** for instant effects
- **Live Preview** with real-time updates
- **Advanced Physics** (gravity, spin, vibration, attraction)
- **Interactive Effects** (hover, click, connections)
- **Multi-Color Support** with visual palette editor
- **Dark Mode** support

## 🎨 Presets Included

- **Basic** - Clean, minimal particle field
- **Snow** - Gentle falling snowflakes with twinkle
- **Rainbow** - Colorful, vibrant particle system
- **Network** - Connected network visualization
- **Bubbles** - Floating bubble effect
- **Matrix** - Digital rain effect
- **Galaxy** - Cosmic star field with attraction
- **Neon** - Bright, energetic neon particles

## 🔧 Development

### Project Structure
```
mojave-particles/
├── src/
│   ├── App.tsx          # Main plugin interface
│   ├── App.css          # Styles
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── mojave_assets/       # Plugin assets
└── package.json         # Dependencies and scripts
```

### Key Components
- **LivePreview** - Real-time canvas preview
- **ParticleConfig** - Complete configuration interface
- **Presets** - Professional preset library
- **Controls** - Comprehensive UI controls

### Building
```bash
# Development build
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Clean build artifacts
npm run clean
```

## 📦 Distribution

### Packing for Framer
```bash
npm run pack
```

This creates a `.framerx` file ready for distribution.

### Installation
1. Run `npm run pack` to create the plugin package
2. Import the `.framerx` file into Framer
3. Add to your canvas and customize

## 🎯 Usage

### Basic Implementation
```tsx
// The plugin generates complete particle systems
// Users can customize via the intuitive interface
// No code required - just drag and drop!
```

### Advanced Customization
All settings are available through the plugin interface:
- Particle amount, size, opacity
- Movement physics and boundaries
- Interactive effects and connections
- Color palettes and visual effects

## 🔍 Troubleshooting

### Common Issues
- **Build errors**: Run `npm run clean` then `npm install`
- **Type errors**: Run `npm run type-check`
- **Lint errors**: Run `npm run lint`

### Performance
- Use 50-100 particles for mobile devices
- Disable complex effects for better performance
- Test on target devices

## 📄 License

© 2025 Mojave Studio LLC - All Rights Reserved

This is proprietary software. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## 🌟 Support

- **Documentation**: See main README.md
- **Issues**: GitHub Issues
- **Contact**: info@mojavestud.io

---

Built with ❤️ for the Framer community by Mojave Studio
