# 🌟 Mojave Particles Pro v1.2.0

**© 2025 Mojave Studio LLC - All Rights Reserved**

A professional, proprietary particle system plugin for Framer with advanced animations and interactive effects.

![Mojave Particles Demo](https://img.shields.io/badge/Framer-Plugin-blue?style=for-the-badge&logo=framer)
![License](https://img.shields.io/badge/License-Commercial-red?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.2.0-green?style=for-the-badge)

⚠️ **PROPRIETARY SOFTWARE - COMMERCIAL LICENSE REQUIRED**

## 🔐 Licensing & Usage

This is **proprietary commercial software**. All rights reserved.

### ✅ What's Allowed:
- Use within licensed Framer projects
- Create content for your clients using the plugin
- Publish websites that use the plugin (with valid license)

### 🚫 What's NOT Allowed:
- Copying, modifying, or redistributing the source code
- Reverse engineering or decompilation
- Creating derivative works
- Sharing the plugin files with others
- Using outside of the Framer platform

**For licensing inquiries:** info@mojavestud.io

## 🚀 Installation (Licensed Users Only)

### Method 1: Framer Plugin Store (Recommended)
1. Open Framer Desktop
2. Go to **Plugins** → **Browse Marketplace**
3. Search for "Mojave Particles Pro"
4. Install directly to your project

### Method 2: Local Development
1. Download the licensed plugin package
2. Enable **Developer Tools** in Framer:
   - **Framer** → **Plugins** → **Developer Tools** ✅
3. Load the plugin:
   - **Plugins** → **Open Development Plugin**
   - Select the `mojave-particles` folder

## 🎛️ Development Environment Setup

### Prerequisites
- Node.js 18+ 
- NPM or Yarn
- Framer Desktop app
- Valid commercial license

### Running the Plugin Locally

```bash
# Navigate to plugin directory
cd mojave-particles

# Install dependencies
npm install

# Start development server
npm run dev:plugin

# In a new terminal, start Framer and load the development plugin
```

### Building for Distribution

```bash
# Build production version (obfuscated)
npm run build

# Pack for Framer plugin distribution
npm run pack
```

## ✨ Features

### 🎨 **Professional Effects**
- **Multiple Colors**: Single color or color arrays with random selection
- **Size Control**: Fixed values or dynamic ranges for varied particle sizes  
- **Opacity Control**: Fixed, range-based, or random opacity values
- **Background Opacity**: Perfect for layering multiple particle components
- **Border Radius**: Rounded corners for container styling

### 🎭 **Advanced Animations**
- **Movement**: Configurable speed, direction, and physics with boundary bouncing
- **Twinkle/Pulse**: Beautiful pulsing opacity effects with customizable speed and range
- **Time Limits**: Set animation duration with perfect looping or stop options
- **Smooth Performance**: Hardware-accelerated rendering for smooth animations

### 🎯 **Interactive Hover Effects**
- **Repulse**: Particles move away from cursor
- **Grab**: Particles are drawn toward cursor
- **Bubble**: Particles grow when hovered
- **Connect**: Show connections between nearby particles
- **Trail**: Particles leave trails following the cursor

### 🚀 **Performance & Security**
- **Code Obfuscation**: Advanced protection against unauthorized copying
- **Runtime Verification**: License validation and anti-tampering measures
- **Hardware Acceleration**: GPU-accelerated for smooth performance
- **Optimized Bundle**: Minified and compressed for fast loading
- **TypeScript**: Full type safety and IntelliSense support

## 🎨 Usage Examples

### Basic Configuration
```tsx
<MojaveParticles 
    amount={100}
    color="#ffffff"
    backdrop="#141414"
/>
```

### Advanced Setup
```tsx
<MojaveParticles 
    amount={150}
    colors={["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1"]}
    size={{ type: "Range", min: 2, max: 8 }}
    opacity={{ type: "Range", min: 0.3, max: 0.9 }}
    move={{ 
        enable: true, 
        speed: 3,
        timeLimit: 10,
        loopAnimation: true
    }}
    hover={{ 
        enable: true, 
        mode: "repulse" 
    }}
    twinkle={{ 
        enable: true, 
        speed: 1.2, 
        minOpacity: 0.1, 
        maxOpacity: 1 
    }}
    backgroundOpacity={1}
    backdrop="#0a0a0a"
    radius={20}
/>
```

## 🔧 Plugin Development Workflow

### 1. Setup Development Environment
```bash
npm run dev:plugin
```

### 2. Enable Developer Tools in Framer
- **Main Menu** → **Plugins** → **Developer Tools** ✅

### 3. Load Development Plugin  
- **Plugins** toolbar → **Open Development Plugin**
- Navigate to the `mojave-particles` folder
- The plugin will auto-reload on file changes

### 4. Testing
- Add the plugin to a Framer component
- Test all property controls
- Verify animations and interactions

### 5. Production Build
```bash
npm run build     # Creates obfuscated build
npm run pack      # Packages for distribution
```

## 🛡️ Security Features

### 🔒 **Anti-Piracy Protection**
- Runtime license verification
- Code obfuscation and minification
- Anti-tampering mechanisms
- Usage tracking and validation

### 🔐 **Proprietary Algorithms**
- Patent-pending particle physics
- Advanced rendering optimizations
- Custom interaction systems
- Proprietary color handling

## 📝 Property Reference

### Core Properties
- `amount`: Number of particles (0-300)
- `color`: Primary particle color  
- `colors`: Array of colors for multi-colored particles
- `backdrop`: Background color
- `backgroundOpacity`: Background transparency (0-1)

### Animation
- `move`: Movement configuration object
- `twinkle`: Twinkle/pulse effect settings
- `hover`: Hover interaction modes

### Styling
- `size`: Particle size (fixed or range)
- `opacity`: Particle opacity (fixed or range)
- `radius`: Container border radius

*Full API documentation available to licensed users*

## 🐛 Support

### Licensed User Support
- **Priority Email Support**: info@mojavestud.io
- **Documentation Portal**: https://docs.mojavestud.io
- **Updates & Patches**: Automatic via Framer Plugin Store

### Self-Service
- Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Review [Common Issues](KNOWN_ISSUES.md)
- Join the [Community Forum](your-community-link.com)

## 📄 Legal

### Copyright Notice
© 2025 Mojave Studio LLC. All Rights Reserved.

### Patent Protection
This software is protected by pending patent applications for particle system technology and interactive animation methods.

### License Compliance
By using this software, you agree to the terms of the [Commercial License](LICENSE).

### Anti-Piracy Notice  
This software contains advanced protection mechanisms. Unauthorized usage will be detected and may result in legal action.

---

**🌟 Signature**: `MOJAVE_PARTICLES_AUTHENTICATED_v1.2.0_2025`

**Built with ❤️ for the Framer community**

[**🔗 Get Licensed**](https://mojavestud.io/plugins) | [**📧 Contact**](mailto:info@mojavestud.io) | [**🌐 Website**](https://mojavestud.io) 