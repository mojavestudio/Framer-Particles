# 📝 Changelog

All notable changes to Mojave Particles will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2025-01-24

### 🚀 Infinite Streams & Hover Interactions
- **Fixed Infinite Stream Logic**: Eliminated banding issues with natural continuous particle flows
- **Enhanced Hover Interactions**: Added proper mouse tracking for bubble, grab, and attract effects
- **Natural Speed Variation**: Particles now move at varied speeds (0.6x to 1.4x) for organic movement
- **Eliminated Violent Motion**: Particles stay within canvas bounds, no more artifacts outside view
- **Unified Positioning System**: Consistent particle distribution for initial creation and boundary reset
- **Improved Bubble Effects**: Particles grow naturally when hovering with bubble mode enabled
- **Better Boundary Handling**: Particles reset at edges with natural distribution patterns

### 🎯 Technical Improvements
- **Mouse Event Handlers**: Added proper mousemove and mouseleave event listeners
- **Hover Interaction Logic**: Implemented distance-based hover effects with force calculations
- **Particle Size Reset**: Added proper size reset each frame for dynamic bubble scaling
- **Speed Variation**: Replaced consistent speeds with natural variation for more realistic movement
- **Boundary Logic**: Fixed infinite mode to keep particles within canvas bounds
- **Event Cleanup**: Proper cleanup of mouse event listeners to prevent memory leaks

### 🔧 Bug Fixes
- **Fixed**: Particles appearing in bands due to inconsistent positioning systems
- **Fixed**: Violent motion artifacts from particles spawning outside canvas bounds
- **Fixed**: Missing hover interactions in generated code
- **Fixed**: Large gaps between initial and subsequent particle streams
- **Fixed**: Inconsistent speed variation between live preview and generated code

### ✨ User Experience
- **Natural Movement**: Particles now flow organically without artificial patterns
- **Responsive Interactions**: Hover effects work consistently across all particle types
- **Smooth Animations**: No more jarring artifacts or violent motion
- **Continuous Streams**: Infinite mode creates seamless, natural particle flows

## [1.2.3] - 2025-01-24

### 🚀 Major UI/UX Improvements
- **Enhanced Particle Size Controls**: Now supports particles up to 2000px with dual slider + number input controls
- **Improved UI Organization**: Completely reorganized settings into logical groups (Canvas Settings, Particle Appearance, Particle Properties)
- **Professional Icon System**: Replaced emojis with consistent Phosphor icons throughout the interface
- **Enhanced Color Palette**: Improved color management with random color generation, better visual design, and clear user instructions

### 🎨 Interface Redesign
- **Canvas Settings Section**: Groups canvas dimensions, background color/opacity, and border radius
- **Particle Appearance Section**: Contains particle count, primary color, and multi-color palette management
- **Particle Properties Section**: Dedicated section for size and opacity controls with enhanced input methods
- **Reorganized Interactions**: Split complex interactions into three clear sections:
  - **Particle Connections** (LinkSimple icon): Connection line settings with clear descriptions
  - **Mouse Interactions** (CursorClick icon): Hover/click effects with descriptive option labels
  - **Interaction Distances** (Ruler icon): Fine-tuning ranges and strengths with helpful explanations

### ✨ Enhanced Controls
- **Dual Size Input**: Slider (1-500px) + number field (1-2000px) for precise control
- **Improved Color Palette**: Random color generation, larger swatches (35x35px), color counter, tooltips
- **Descriptive Labels**: Clear explanations for all interaction modes (e.g., "Grab - Pull particles toward cursor")
- **Helper Text**: Context descriptions for every setting explaining its purpose and effect

### 🎯 User Experience
- **Intuitive Grouping**: Related settings logically organized for better workflow
- **Professional Icons**: Consistent Phosphor icon system replaces emoji inconsistencies
- **Clear Instructions**: Every setting includes helpful descriptions and usage hints
- **Enhanced Accessibility**: Better visual hierarchy and improved readability

### 🔧 Technical Enhancements
- **Flexible Size Support**: Particle system now handles large particles efficiently
- **Improved Input Validation**: Number inputs with proper min/max bounds and fallbacks
- **Better Visual Feedback**: Enhanced tooltips, color counters, and status indicators

## [1.2.2] - 2025-01-24

### 🎯 Major Feature Enhancements
- **Fixed Size Components**: Components now use exact dimensions from plugin configuration instead of responsive containers
- **Comprehensive Property Controls**: Added full 50+ property controls matching original component capabilities
- **Interactive Hover Effects**: Enabled hover attraction by default for all presets (Basic, Snow, Bubbles, Matrix)
- **Fixed Component Generation**: Resolved "Code File was not found" error with proper JavaScript syntax
- **Enhanced Sidebar Customization**: Complete feature parity between plugin interface and Framer sidebar controls

### 🔧 Technical Improvements
- **Fixed Canvas Sizing**: Components now render at specified width/height (800x600 default) with proper container wrapping
- **Corrected Color Parsing**: Fixed template literal escaping issue in generated component code
- **Enhanced Property Structure**: Added comprehensive nested controls for Size, Opacity, Twinkle, Movement, Interactions
- **Improved Type Safety**: Added proper TypeScript interfaces for all configuration objects
- **Optimized Build**: Clean production build with no console.log statements or debug code

### ✨ User Experience
- **Instant Interaction**: All presets now have engaging hover effects by default
- **Professional Controls**: Full access to particle physics, animations, and interactive effects
- **Consistent Sizing**: Particles maintain exact dimensions across plugin preview and inserted components
- **Real-time Updates**: All property changes reflect immediately in both live preview and inserted components
- **Comprehensive Customization**: Users can adjust everything from basic colors to advanced physics simulations

### 🎨 Preset Improvements
- **Basic Preset**: Now includes hover attraction for better interactivity
- **Snow Preset**: Added gentle hover interactions
- **Bubbles Preset**: Enhanced with bubble hover effects
- **Matrix Preset**: Includes repulse interactions for digital rain effect
- **All Presets**: Maintained existing unique characteristics while adding consistent hover behavior

### 🧹 Code Quality
- **Removed Debug Code**: Cleaned up all console.log statements and temporary debugging
- **Streamlined Architecture**: Maintained clean component generation under 100 lines
- **Error Handling**: Robust error handling for component creation and Framer API interactions
- **Documentation**: Comprehensive inline code documentation and user-facing guides

### 🔧 Bug Fixes
- **Fixed**: "Code File was not found" error due to malformed JavaScript in generated components
- **Fixed**: Component sizing issues where particles appeared in wrong dimensions
- **Fixed**: Template literal escaping causing syntax errors in generated code
- **Fixed**: Missing property controls preventing full customization in Framer sidebar
- **Fixed**: Inconsistent hover behavior across different presets

### 🎯 Breaking Changes
- **Component Sizing**: Components now use fixed dimensions instead of responsive containers (better for precise layouts)
- **Default Interactions**: Most presets now include hover effects by default (can be disabled in controls)

## [1.2.1] - 2025-01-22

### Added
- **Clean Component Generation**: Replaced 2000+ line components with streamlined ~100 line components
- **Professional Branding**: Added comprehensive copyright headers and licensing information
- **Website Integration**: Added https://mojavestud.io/particles for feature requests and support
- **Custom Background**: Plugin header now matches logo PNG with #000005 background color
- **Enhanced Copyright**: Professional copyright footer in plugin interface (not canvas overlay)
- **AWS Infrastructure**: Complete CI/CD pipeline with GitHub Actions and CloudFormation
- **Marketplace Ready**: Added plugin packaging scripts for Framer Marketplace submission

### Changed
- **Component Templates**: Simplified React imports and component structure
- **Code Quality**: Removed complex licensing verification for cleaner generated code
- **UI Branding**: Updated all contact information to use mojavestud.io domain
- **Professional Footer**: Copyright notice now appears in plugin window, not on canvas
- **Documentation**: Comprehensive AWS deployment and GitHub Actions setup guides

### Fixed
- **Template Generation**: Fixed syntax errors in generated component code
- **Build Process**: Cleaned up temporary files and optimized build output
- **Development Server**: Stable HTTPS development server for local testing
- **Theme Compatibility**: Restored proper system color support for dark/light mode
- **Color Scheme**: Fixed plugin UI colors to work correctly in both themes

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