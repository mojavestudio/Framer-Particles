# Changelog

All notable changes to Mojave Particles will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-25

### Added
- 🎨 **Pure Canvas Rendering**: Maximum compatibility across all browsers and Framer versions
- 🎯 **Background Opacity Control**: Perfect layering system for multiple particle components
- ⚡ **Hardware Acceleration**: GPU-accelerated rendering for smooth 60fps performance
- 🎭 **Interactive Hover Effects**: Repulse, grab, bubble, connect, and trail interactions
- ✨ **Twinkle/Pulse Animation**: Beautiful pulsing opacity effects with customizable parameters
- ⏱️ **Time-Limited Animations**: Set duration limits with perfect looping or stop options
- 🎨 **Advanced Color System**: Support for single colors, color arrays, and Framer design tokens
- 📏 **Flexible Sizing**: Fixed values or dynamic ranges for particle sizes and opacity
- 🎯 **Boundary Physics**: Particles bounce naturally off container edges
- 🧹 **Clean Architecture**: Optimized, TypeScript-ready codebase with no external dependencies

### Technical Improvements
- Removed unused tsParticles dependencies for lighter bundle size
- Fixed JavaScript hoisting issues with proper function declarations
- Eliminated purple line scrolling artifacts with enhanced CSS styling
- Optimized useEffect dependencies for better performance
- Added comprehensive TypeScript type annotations
- Implemented proper canvas sizing and scaling for all devices

### Performance
- Bundle size: 37.83 kB minified, 10.03 kB gzipped
- Zero external dependencies beyond React and Framer
- Hardware-accelerated rendering with `transform3d`
- Efficient particle physics calculations
- Smart cleanup and memory management

### Documentation
- Comprehensive README with usage examples
- Full property reference documentation
- Troubleshooting guide
- Development setup instructions
- Multiple usage examples (starfield, network, bubbles)

## [Unreleased]

### Planned Features
- Additional particle shapes (squares, triangles, custom)
- Particle collision detection and physics
- Advanced trail effects
- Performance profiling tools
- React Native compatibility

---

**Legend:**
- 🎨 Visual Features
- 🎯 Interaction Features  
- ⚡ Performance Improvements
- 🧹 Code Quality
- 📚 Documentation 