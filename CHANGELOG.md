# 📝 Changelog

All notable changes to Mojave Particles will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Dual-Mode Plugin Architecture**: Both plugin window (insertion/quick editing) and Framer sidebar (full customization) now work together
- **Improved Sizing System**: Plugin window controls dictate initial sizing, with proper Framer scaling and responsiveness
- **Enhanced Professional Presets**: Restored all original presets (network, bubbles, matrix, galaxy, neon) with proper sizing configurations
- **Live Preview in Plugin**: Real-time animated particle preview in the plugin window
- **Edit Mode**: Can now select and modify existing particle components directly from the plugin
- **Better Template Literal Handling**: Fixed syntax issues in generated component code for reliable deployment
- Performance optimizations for large particle counts
- Enhanced mobile touch interactions
- Improved accessibility features

### Changed
- **Component Generation**: Fixed sizing logic to properly use configured dimensions while respecting Framer's container scaling
- **UI Layout**: Reorganized plugin window for better workflow (presets → sizing → detailed controls)
- **Template System**: Improved generated component code structure for better maintainability
- Updated dependency versions
- Refactored particle physics engine

### Fixed
- Memory leak in long-running animations
- Touch event handling on mobile devices

## [1.2.0] - 2025-01-XX

### Added
- **Complete particle system** with 50+ professional controls
- **8 Professional presets** (Basic, Snow, Rainbow, Network, Bubbles, Matrix, Galaxy, Neon)
- **Live preview** with real-time updates
- **Advanced physics** (gravity, spin, vibration, attraction)
- **Multi-color palette** with visual editor and add/remove controls
- **Dark mode** support with automatic theme detection
- **Create/Edit modes** for workflow optimization
- **Comprehensive interaction system** (hover, click, connections)
- **Boundary behavior controls** (wrap, bounce, destroy)
- **Trail effects** with customizable length
- **Connection system** with opacity and distance controls
- **Advanced movement options** (random, straight, vibration)
- **Parallax effects** for enhanced interactivity
- **Size settings** for custom width/height
- **Opacity controls** (fixed, range, random)
- **Enhanced twinkle effects** with min/max opacity
- **Professional UI** with intuitive controls and grouping

### Changed
- **Complete rewrite** of particle system architecture
- **Enhanced performance** with optimized rendering
- **Improved user experience** with better control organization
- **Professional styling** with consistent design language

### Fixed
- **Z-index issues** with live preview overlay
- **Toggle button styling** for dark mode compatibility
- **Refresh button sizing** for better proportions
- **TypeScript errors** and type safety improvements

## [1.1.0] - 2024-12-XX

### Added
- Enhanced hover interactions for all modes
- Improved color handling for Framer Design Tokens
- Optimized loop reset performance
- Time limit and looping controls

### Changed
- Simplified mode selection (just Spline Mode toggle)
- Improved animation performance

### Fixed
- Animation stopping after 5 seconds
- Color compatibility issues

## [1.0.0] - 2024-11-XX

### Added
- Initial release with basic particle system
- Canvas rendering with hover interactions
- Basic particle customization (color, size, amount)
- Simple movement and physics
- Basic preset system

---

## Version History

- **v1.2.0** - Complete professional particle system with 50+ controls
- **v1.1.0** - Enhanced interactions and performance improvements  
- **v1.0.0** - Initial release with basic functionality

## Migration Guide

### From v1.1.0 to v1.2.0
- **Breaking Changes**: Complete rewrite with new architecture
- **New Features**: 50+ new controls and 8 professional presets
- **Migration**: Use new interface for all customization

### From v1.0.0 to v1.1.0
- **No Breaking Changes**: Backward compatible
- **New Features**: Enhanced interactions and performance
- **Migration**: Automatic, no changes required

---

For detailed information about each version, see the [GitHub releases](https://github.com/your-username/mojave-particles/releases). 