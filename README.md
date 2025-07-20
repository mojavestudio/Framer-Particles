# Mojave Particles - Framer Plugin

A beautiful, customizable particle system plugin for Framer that creates stunning interactive particle effects with extensive customization options.

![Mojave Particles](https://mojavestudio.github.io/Framer-Particles/)

## ✨ Features

- **50+ Customization Options** - Fine-tune every aspect of your particle system
- **Multiple Particle Shapes** - Circle, square, triangle, star, heart, and more
- **Interactive Modes** - Click, hover, grab, repulse, attract, and connect effects
- **Physics-Based Movement** - Realistic particle physics with gravity, spin, and trails
- **Responsive Design** - Automatically adapts to any container size
- **Performance Optimized** - Smooth animations with configurable FPS
- **Canvas Mode** - Compatible with Spline and other embedded viewers
- **Real-time Preview** - See changes instantly in Framer's canvas

## 🚀 Quick Start

### Installation

1. **Enable Developer Tools** in Framer
   - Go to Framer's main menu
   - Navigate to Plugin section
   - Enable "Developer Tools"

2. **Open Development Plugin**
   - Click the Plugin menu in the toolbar
   - Click "Open Development Plugin"
   - Use URL: `https://mojavestudio.github.io/Framer-Particles/`

3. **Add to Your Project**
   - Drag the plugin onto your canvas
   - Customize using the property panel

## 🎨 Customization Options

### Visual Properties
- **Background** - Set custom background colors
- **Particle Colors** - Single color or multiple color arrays
- **Particle Shapes** - Circle, square, triangle, star, heart, etc.
- **Size & Opacity** - Fixed values or random ranges
- **Border Radius** - Round the container corners

### Particle Behavior
- **Amount** - Control number of particles (0-300)
- **Movement** - Speed, direction, and physics options
- **Links** - Connect particles with customizable lines
- **Collisions** - Bounce, destroy, or absorb on collision
- **Gravity** - Add realistic gravity effects
- **Spin & Rotation** - Rotate particles with animation

### Interactive Effects
- **Click Modes** - Push, remove, attract, repulse, bubble
- **Hover Modes** - Grab, connect, light, trail effects
- **Parallax** - 3D-like depth effects
- **Force & Smoothness** - Control interaction sensitivity

### Advanced Features
- **Density Control** - Adjust particle density based on area
- **Trail Effects** - Particle movement trails
- **Wave Motion** - Sine wave particle movement
- **Spiral Movement** - Circular particle paths
- **Orbit Effects** - Particles orbiting around centers
- **Magnetic Fields** - Attract particles to specific points

## 🔧 Technical Details

### Compatibility
- **Framer** - Full compatibility with Framer's plugin system
- **Spline** - Canvas mode for embedded viewers
- **React** - Built with React and TypeScript
- **tsParticles** - Powered by the tsParticles engine

### Performance
- **FPS Control** - 30, 60, or 120 FPS options
- **Optimized Rendering** - Efficient canvas and WebGL rendering
- **Memory Management** - Automatic cleanup and resource management

### File Structure
```
mojave-particles/
├── particles.tsx          # Main plugin component
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Build configuration
├── eslint.config.js       # Code quality rules
├── src/                   # Source files
├── public/                # Static assets
└── dist/                  # Built plugin (auto-generated)
```

## 🎯 Use Cases

- **Hero Sections** - Create engaging landing page backgrounds
- **Interactive Cards** - Add particle effects to UI components
- **Loading States** - Animated loading indicators
- **Background Effects** - Subtle ambient animations
- **Interactive Forms** - Enhance user engagement
- **Portfolio Showcases** - Creative project presentations

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Building for Framer
```bash
# Pack plugin for Framer
npm run pack
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes and updates.

## 🔗 Links

- **Live Demo**: https://mojavestudio.github.io/Framer-Particles/
- **GitHub Repository**: https://github.com/mojavestudio/Framer-Particles
- **Framer Plugin**: Available in Framer's plugin marketplace

## 💡 Tips

1. **Start Simple** - Begin with basic settings and gradually add complexity
2. **Performance** - Use fewer particles (50-100) for better performance
3. **Interactions** - Enable hover effects for better user engagement
4. **Colors** - Use contrasting colors for better visibility
5. **Testing** - Test on different screen sizes for responsive behavior

---

**Created with ❤️ by Mojave Studio** 