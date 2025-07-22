# 📁 Project Structure

This document outlines the organization of the Mojave Particles project.

## 🗂️ Root Directory

```
mojave-particles/
├── README.md              # Main project documentation
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md          # Version history and changes
├── LICENSE               # Proprietary license
├── PROJECT_STRUCTURE.md  # This file
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
├── eslint.config.js     # ESLint configuration
├── framer.json          # Framer plugin configuration
└── index.html           # Entry HTML file
```

## 📦 Source Code (`src/`)

```
src/
├── App.tsx              # Main plugin interface and logic
├── App.css              # Component styles
└── main.tsx             # Application entry point
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

## 🎨 Assets

```
public/
├── icon.png             # Plugin icon (light mode)
└── icon-dark.png        # Plugin icon (dark mode)

mojave_assets/
├── Planets (180 x 180 px).png      # Plugin assets
└── Planets (180 x 180 px) (1).png  # Additional assets
```

## ⚙️ Configuration Files

### `package.json`
- **Dependencies**: React, Framer Plugin API, Phosphor Icons
- **Scripts**: Development, build, pack, lint, type-check
- **Metadata**: Version, author, description, keywords

### `tsconfig.json`
- **TypeScript configuration** for strict type checking
- **Module resolution** and compilation options
- **Target settings** for modern browsers

### `vite.config.ts`
- **Build configuration** for Vite
- **React plugin** integration
- **Development server** settings

### `framer.json`
- **Plugin metadata** for Framer integration
- **UI configuration** and positioning
- **Version compatibility** settings

### `eslint.config.js`
- **Code linting** rules and configuration
- **TypeScript support** for ESLint
- **React-specific** linting rules

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

## 🔍 Development Workflow

1. **Setup**: `npm install` to install dependencies
2. **Development**: `npm run dev` to start development server
3. **Testing**: Test in Framer with live preview
4. **Building**: `npm run build` for production build
5. **Packing**: `npm run pack` for Framer distribution

## 🚀 Deployment

### For Framer Users
1. Run `npm run pack` to create `.framerx` file
2. Import into Framer project
3. Add to canvas and customize

### For Developers
1. Fork and clone repository
2. Install dependencies with `npm install`
3. Start development with `npm run dev`
4. Make changes and test in Framer
5. Submit pull request

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

---

This structure provides a clean, maintainable, and scalable foundation for the Mojave Particles plugin. 