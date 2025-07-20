# Mojave Particles

A powerful, customizable particles component for Framer with extensive animation options and Spline compatibility.

[![npm version](https://badge.fury.io/js/mojave-particles.svg)](https://badge.fury.io/js/mojave-particles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framer Plugin](https://img.shields.io/badge/Framer-Plugin-blue.svg)](https://framer.com)

## ✨ Features

- 🎨 **50+ Customizable Properties** - Control every aspect of your particles
- 🎯 **Multiple Animation Modes** - Static, animated, and interactive particles
- 🔗 **Particle Links** - Connect particles with customizable lines
- 🎮 **Interactive Effects** - Click and hover interactions with various modes
- 🎪 **Spline Compatibility** - Canvas mode for embedding in Spline projects
- ⚡ **Performance Optimized** - Efficient rendering with configurable FPS
- 🎛️ **Rich Controls** - Full property panel integration with Framer

## 🚀 Quick Start

```tsx
import { MojaveParticles } from "mojave-particles"

export default function MyComponent() {
  return (
    <MojaveParticles
      amount={50}
      color="#ffffff"
      backdrop="#141414"
      move={{ enable: true, speed: 2 }}
      links={{ enable: true, distance: 150 }}
    />
  )
}
```

## 📦 Installation

### Framer Community
1. Open Framer
2. Go to the Community tab
3. Search for "Mojave Particles"
4. Click "Add to Project"

### Manual Installation
```bash
npm install mojave-particles
```

## 🎨 Examples

### Floating Particles
```tsx
<MojaveParticles
  amount={30}
  color="#ffffff"
  backdrop="#000000"
  size={{ type: "Range", min: 2, max: 6 }}
  move={{ enable: true, speed: 1.5, random: true }}
/>
```

### Connected Network
```tsx
<MojaveParticles
  amount={80}
  color="#00ff88"
  links={{ enable: true, distance: 120 }}
  hover={{ enable: true, mode: "grab" }}
/>
```

## 🔧 Configuration

### Basic Settings
- **Background**: Set the background color
- **Color/Colors**: Single or multiple particle colors
- **Amount**: Number of particles (0-300)
- **FPS**: Animation frame rate (30, 60, 120)

### Particle Properties
- **Size**: Fixed value or range with min/max
- **Opacity**: Fixed value or range with min/max
- **Shape**: Circle, square, triangle, polygon, star, etc.
- **Density**: Control particle distribution

### Movement & Interactions
- **Speed & Direction**: Control particle movement
- **Links**: Connect particles with customizable lines
- **Click & Hover**: Interactive effects with various modes
- **Special Modes**: Spline compatibility, test mode, preview animation

## 🎪 Spline Integration

For use in Spline projects:
1. Enable **Spline Mode** in property controls
2. Set **Preview Animation** to your preference
3. Copy component to your Spline project
4. Particles render using canvas for maximum compatibility

## 📚 Documentation

- [Full Documentation](https://github.com/yourusername/mojave-particles#readme)
- [Examples & Tutorials](https://github.com/yourusername/mojave-particles/examples)
- [API Reference](https://github.com/yourusername/mojave-particles/wiki)
- [Troubleshooting](https://github.com/yourusername/mojave-particles#troubleshooting)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/yourusername/mojave-particles.git
cd mojave-particles
npm install
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mojave-particles/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mojave-particles/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/mojave-particles/wiki)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/mojave-particles&type=Date)](https://star-history.com/#yourusername/mojave-particles&Date)

---

Made with ❤️ for the Framer community

[![Framer](https://img.shields.io/badge/Framer-Community-orange.svg)](https://framer.com/community)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A.svg?logo=react&logoColor=61DAFB)](https://reactjs.org/) 