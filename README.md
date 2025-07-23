# 🌟 Mojave Particles Pro

A professional-grade particle system plugin for Framer with advanced animations, physics, and interactive effects. Features clean component generation, professional branding, and full AWS deployment infrastructure.

## 📁 Repository Structure

```
particles/
├── mojave-particles/          # Main Framer plugin
│   ├── src/                   # Plugin source code
│   │   ├── App.tsx           # Main plugin interface and logic
│   │   ├── App.css           # Component styles
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Assets
│   │   ├── icon.png          # Plugin icon (light mode)
│   │   └── icon-dark.png     # Plugin icon (dark mode)
│   ├── scripts/              # Build scripts
│   ├── README.md             # Detailed plugin documentation
│   ├── package.json          # Plugin dependencies and scripts
│   ├── framer.json           # Framer plugin configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vite.config.ts        # Vite build configuration
│   ├── eslint.config.js      # ESLint configuration
│   └── index.html            # Entry HTML file
├── .github/                   # GitHub workflows
└── README.md                 # This file
```

### Key Components

#### `App.tsx`
- **Main plugin interface** with all controls and UI
- **LivePreview component** for real-time particle preview
- **ParticleConfig interface** defining all configuration options
- **Preset library** with 8 professional presets
- **Dark mode detection** and theme management
- **Framer integration** with create/edit modes

#### `App.css`
- **Global styles** and CSS variables
- **Dark/light mode** theme definitions
- **Component styling** for controls and UI elements

#### `main.tsx`
- **React application** entry point
- **Framer plugin** initialization
- **Development server** configuration

## 🚀 Quick Start

### For Framer Users
1. Install the plugin from the Framer Plugin Store
2. Add to your canvas and customize with the intuitive controls
3. Use presets for instant professional effects

### For Developers
```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Plugin will be available at https://localhost:5173/
```

## ✨ Key Features

- **Clean Component Generation**: ~100 line components instead of 2000+ line dumps
- **Professional Branding**: Comprehensive copyright and mojavestud.io integration
- **8 Professional Presets**: Network, Bubbles, Matrix, Galaxy, Neon, and more
- **Advanced Physics**: Gravity, spin, vibration, attraction effects
- **Interactive Effects**: Hover, click, and connection systems
- **Live Preview**: Real-time preview in plugin window
- **Dark Mode Support**: Automatic theme detection

## 🔧 Build Process

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

## 📊 Data Flow

```
User Input → App.tsx → ParticleConfig → LivePreview → Canvas Rendering
     ↓
Framer Plugin API → Component Generation → Framer Canvas
```

## 🎯 Key Features by File

### Core Functionality (`App.tsx`)
- **50+ Controls** for particle customization
- **8 Professional Presets** for instant effects
- **Live Preview** with real-time updates
- **Create/Edit Modes** for workflow optimization
- **Dark Mode** support with automatic detection

### Rendering (`LivePreview` component)
- **Canvas-based** particle rendering
- **Physics simulation** (gravity, spin, vibration)
- **Interactive effects** (hover, click, connections)
- **Performance optimization** with requestAnimationFrame

### Configuration (`ParticleConfig` interface)
- **Complete type definitions** for all settings
- **Validation** and default values
- **Extensibility** for future features

## 📚 Documentation

- **[Main Plugin Documentation](mojave-particles/README.md)** - Complete feature guide and API reference
- **[Development Guide](mojave-particles/DEVELOPMENT_GUIDE.md)** - Local development setup
- **[Framer Publishing Guide](mojave-particles/FRAMER_PUBLISHING.md)** - Marketplace submission process

## 🔄 Development Workflow

### Local Development
```bash
cd mojave-particles
npm run dev
# Available at https://localhost:5173/
```

## 🎨 Preview

### Plugin Interface
- Clean, professional UI with #000005 background matching logo
- Live particle preview with real-time updates
- Intuitive preset selection and customization controls
- Professional copyright footer

### Generated Components
- Streamlined React components (~100 lines)
- Professional copyright headers
- mojavestud.io branding and contact information
- Clean canvas rendering without overlays

## 🔍 Development Workflow

1. **Setup**: `npm install` to install dependencies
2. **Development**: `npm run dev` to start development server
3. **Testing**: Test in Framer with live preview
4. **Building**: `npm run build` for production build
5. **Packing**: `npm run pack` for Framer distribution

## 📝 Code Organization

### Component Structure
- **Functional components** with React hooks
- **TypeScript interfaces** for type safety
- **CSS-in-JS** for component styling
- **Modular architecture** for maintainability

### State Management
- **React useState** for local component state
- **Configuration objects** for particle settings
- **Preset management** for quick configurations
- **Theme detection** for dark/light mode

### Performance Considerations
- **Canvas optimization** for smooth rendering
- **Memory management** for particle cleanup
- **Conditional rendering** for inactive features
- **Efficient updates** with React optimization

## 📝 Latest Updates (v1.2.1)

- ✅ **Clean Component Generation**: Eliminated 2000+ line code dumps
- ✅ **Professional Branding**: Added comprehensive copyright and contact info
- ✅ **Website Integration**: https://mojavestud.io/particles for support
- ✅ **Custom UI Styling**: Plugin background matches logo PNG
- ✅ **Marketplace Ready**: Professional packaging scripts

## 🌟 Support

- **Website**: [https://mojavestud.io/particles](https://mojavestud.io/particles) - Feature requests and questions
- **Documentation**: [mojave-particles/README.md](mojave-particles/README.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/mojave-particles/issues)
- **Contact**: info@mojavestud.io

---

Copyright Mojave Studio 2025 - mojavestud.io - Custom Automated Web Design experts

Built with ❤️ for the Framer community 