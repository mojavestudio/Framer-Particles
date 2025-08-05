# 🛠️ Development Guide - Mojave Particles Pro

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm 8+
- Framer account with Developer Tools enabled
- Git for version control

### **Setup**
```bash
# Clone and setup
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## 📁 Project Structure

```
mojave-particles/
├── src/
│   ├── plugin.tsx                    # Main plugin interface (3057 lines)
│   ├── EnhancedParticleRenderer.tsx  # Live preview component (709 lines)
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts                 # TypeScript declarations
├── public/
│   ├── icon.png                      # Plugin icon
│   └── icon-dark.png                 # Dark mode icon
├── scripts/
│   └── pack.js                       # Plugin packaging script
├── framer.json                       # Plugin configuration
├── vite.config.ts                    # Build configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.js                  # ESLint configuration
└── package.json                      # Dependencies and scripts
```

## 🔧 Key Components

### **📄 Main Plugin Interface (`src/plugin.tsx`)**
- **Complete UI system** - All property controls and presets
- **Generated code template** - Creates Framer-compatible component
- **Preset management** - 9 professional presets
- **Type definitions** - ParticleConfig interface
- **Property controls** - 60+ customization options

### **🎨 Live Preview (`src/EnhancedParticleRenderer.tsx`)**
- **Real-time preview** - Shows particle effects immediately
- **Shape-aware effects** - Glow matches particle shape
- **Physics simulation** - Gravity, reverse gravity, boundaries
- **Mouse interactions** - Hover effects and responses
- **Performance optimized** - Smooth 60fps animations

### **⚙️ Configuration Files**
- **`framer.json`** - Plugin metadata and settings
- **`vite.config.ts`** - HTTPS development server setup
- **`tsconfig.json`** - TypeScript compilation settings
- **`eslint.config.js`** - Code quality and style rules

## 🎯 Development Workflow

### **1. Start Development**
```bash
npm run dev
# Server starts on https://localhost:5173
```

### **2. Load in Framer**
1. Open Framer
2. Go to Plugins → Developer Tools
3. Click "Open Development Plugin"
4. Enter: `https://localhost:5173`
5. Click "Load"

### **3. Make Changes**
- Edit `src/plugin.tsx` for main interface
- Edit `src/EnhancedParticleRenderer.tsx` for preview
- Changes auto-reload in Framer
- Test all presets and features

### **4. Quality Assurance**
```bash
npm run lint          # Check code quality
npm run build         # Test production build
npm run preview       # Preview production build
```

### **5. Package for Distribution**
```bash
npm run pack          # Create plugin package
```

## 🎨 Feature Development

### **Adding New Presets**
1. **Define preset object** in `presets` object
2. **Add button** in preset selection UI
3. **Test physics** - Gravity, boundaries, interactions
4. **Verify effects** - Glow, twinkle, connections
5. **Update documentation** - Add to README

### **Enhancing Physics**
1. **Update interface** - Add new properties to ParticleConfig
2. **Implement logic** - Add to both preview and generated code
3. **Add UI controls** - Create property controls
4. **Test thoroughly** - All presets and edge cases
5. **Update presets** - Apply to relevant presets

### **Improving Visual Effects**
1. **Shape-aware rendering** - Ensure effects match particle shape
2. **Performance optimization** - Maintain 60fps
3. **Cross-browser testing** - Chrome, Firefox, Safari
4. **Mobile responsiveness** - Test on different screen sizes

## 🔍 Code Quality

### **TypeScript Standards**
- **Strict typing** - No `any` types
- **Interface definitions** - Complete ParticleConfig interface
- **Type safety** - All functions properly typed
- **Error handling** - Graceful fallbacks

### **ESLint Rules**
- **No unused variables** - Clean, efficient code
- **Consistent formatting** - Professional appearance
- **Case block braces** - Proper scoping
- **Import organization** - Logical file structure

### **Performance Guidelines**
- **60fps target** - Smooth animations
- **Efficient rendering** - Minimal canvas operations
- **Memory management** - Proper cleanup
- **Responsive design** - Adapts to container size

## 🧪 Testing Strategy

### **Manual Testing Checklist**
- [ ] All 9 presets work correctly
- [ ] Glow effects match particle shapes
- [ ] Reverse gravity works for lava lamp
- [ ] Snow particles exit frame naturally
- [ ] Network connections are visible
- [ ] Mouse interactions respond properly
- [ ] UI controls update preview in real-time
- [ ] Property controls work in Framer

### **Browser Testing**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### **Device Testing**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 🚀 Deployment

### **Development Deployment**
```bash
npm run dev          # Local development
npm run build        # Production build
npm run preview      # Preview build
```

### **Production Deployment**
```bash
npm run pack         # Create plugin package
# Upload to Framer marketplace
```

### **Version Management**
- **Semantic versioning** - MAJOR.MINOR.PATCH
- **Changelog updates** - Document all changes
- **README updates** - Keep documentation current
- **Tag releases** - Git tags for versions

## 📚 Documentation

### **Essential Files**
- **`README.md`** - Main project documentation
- **`RECENT_UPDATES_SUMMARY.md`** - Feature updates
- **`FRAMER_PLUGIN_REQUIREMENTS.md`** - Critical requirements
- **`FRAMER_PUBLISHING.md`** - Publishing guide

### **Code Documentation**
- **Inline comments** - Explain complex logic
- **Function documentation** - JSDoc style comments
- **Interface documentation** - Type definitions
- **Example usage** - Preset configurations

## 🐛 Troubleshooting

### **Common Issues**
- **HTTPS required** - Server must use HTTPS
- **Port 5173** - Must run on exact port
- **TypeScript errors** - Run `npm run lint` to check
- **Build failures** - Check for syntax errors
- **Plugin not loading** - Verify server is running

### **Debug Steps**
1. **Check server status** - `lsof -i :5173`
2. **Clear cache** - `rm -rf .vite && npm run dev`
3. **Reinstall dependencies** - `rm -rf node_modules && npm install`
4. **Check console** - Browser developer tools
5. **Verify configuration** - Check all config files

## 🤝 Contributing

### **Development Process**
1. **Fork repository**
2. **Create feature branch**
3. **Make changes**
4. **Test thoroughly**
5. **Submit pull request**

### **Code Standards**
- **Follow existing patterns** - Maintain consistency
- **Add tests** - Ensure reliability
- **Update documentation** - Keep guides current
- **Check performance** - Maintain 60fps

---

**© 2025 Mojave Studio - mojavestud.io**
*Custom Automated Web Design Experts* 