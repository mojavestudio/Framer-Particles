# 🌟 Mojave Particles Pro

A professional-grade particle system plugin for Framer with advanced animations, physics, and interactive effects.

## ✨ Features

### 🚀 **Dual-Mode Plugin Architecture**
- **Plugin Window**: Quick insertion, live preview, preset selection, and basic editing
- **Framer Sidebar**: Complete customization access when component is selected
- **Edit Mode**: Select and modify existing particle components directly from the plugin
- **Sizing Control**: Plugin window dictates dimensions, Framer handles responsive scaling

### 🎨 **Complete Particle Customization**
- **Colors**: Single color or dynamic multi-color arrays with visual palette editor
- **Size**: Fixed values or dynamic ranges for varied particle sizes
- **Opacity**: Fixed, range-based, or random opacity with full control
- **Amount**: Control particle density (1-300 particles)
- **Border Radius**: Customizable container styling

### ✨ **Advanced Animation Effects**
- **Movement**: Configurable speed, direction, and physics with multiple boundary behaviors
- **Twinkle/Pulse**: Beautiful pulsing opacity effects with customizable speed and range
- **Spin**: Rotating particles with adjustable speed
- **Vibration**: Subtle particle vibration with frequency control
- **Trails**: Particle trail effects with customizable length
- **Gravity**: Realistic gravity simulation with adjustable force

### 🎯 **Interactive Effects**
- **Hover Interactions**: Repulse, Attract, Bubble, Grab, Connect with force and smooth controls
- **Click Effects**: Push, Remove, Repulse, Attract, Bubble with customizable parameters
- **Mouse Attraction**: Particles drawn toward cursor with distance control
- **Parallax**: Depth effects for enhanced interactivity

### 🔗 **Connection & Network Effects**
- **Particle Links**: Connecting lines between particles with opacity control
- **Network Visualization**: Create complex network effects
- **Grab Connections**: Dynamic line drawing on hover
- **Bubble Networks**: Expandable connection networks

### 🎛️ **Professional Controls**
- **Live Preview**: Real-time preview of all changes
- **Preset Library**: 8 professionally crafted presets (Basic, Snow, Rainbow, Network, Bubbles, Matrix, Galaxy, Neon)
- **Create/Edit Modes**: Create new systems or edit existing ones
- **Size Settings**: Custom width/height for any use case
- **Dark Mode**: Automatic theme detection and support

## 🚀 Installation

### For Framer Users
1. Install the plugin from the Framer Plugin Store
2. Add to your canvas and customize with the intuitive controls
3. Use presets for instant professional effects

### For Developers
```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Pack for Framer
npm run pack
```

## 🎨 Usage Examples

### Basic Particle Field
```tsx
<MojaveParticles 
    amount={50}
    color="#ffffff"
    move={{ enable: true, speed: 2 }}
/>
```

### Twinkling Stars Effect
```tsx
<MojaveParticles 
    amount={100}
    colors={["#ffffff", "#ffff99", "#99ccff"]}
    twinkle={{ 
        enable: true, 
        speed: 0.8, 
        minOpacity: 0.1, 
        maxOpacity: 1 
    }}
    move={{ enable: false }}
/>
```

### Interactive Particle Network
```tsx
<MojaveParticles 
    amount={80}
    modes={{ connectRadius: 120, connectLinks: 0.6 }}
    hover={{ 
        enable: true, 
        mode: "grab", 
        force: 60 
    }}
/>
```

### Advanced Physics Simulation
```tsx
<MojaveParticles 
    amount={75}
    move={{
        enable: true,
        direction: "bottom",
        speed: 1.5,
        gravity: true,
        gravityAcceleration: 9.81,
        out: "bounce"
    }}
    hover={{ 
        enable: true, 
        mode: "repulse", 
        force: 80 
    }}
/>
```

## 🎛️ Complete Control Reference

### **Basic Settings**
- **Amount**: Number of particles (1-300)
- **Background**: Backdrop color with opacity control
- **Border Radius**: Container corner radius (0-50px)

### **Appearance**
- **Color**: Primary particle color
- **Multiple Colors**: Dynamic color palette with add/remove controls
- **Size**: Fixed value or min/max range (1-20px)
- **Opacity**: Fixed value, range, or random (0.1-1.0)

### **Twinkle Effect** ✨
- **Enable**: Turn twinkle/pulse effect on/off
- **Speed**: Animation speed (0.1-5)
- **Min Opacity**: Minimum opacity during pulse (0.1-0.8)
- **Max Opacity**: Maximum opacity during pulse (0.2-1.0)

### **Movement & Physics**
- **Enable**: Turn particle movement on/off
- **Direction**: Movement direction (none/top/bottom/left/right/diagonal/random)
- **Speed**: Movement speed (0-50)
- **Gravity**: Enable gravity with adjustable acceleration (0-50)
- **Spin**: Rotating particles with speed control (0.1-10)
- **Vibration**: Particle vibration with frequency (1-100)
- **Attraction**: Mouse attraction with distance control (50-500)
- **Boundary Behavior**: Wrap, bounce, or destroy particles at edges
- **Trail**: Particle trails with length control (5-50)

### **Interactions**
- **Hover Effects**: Repulse, Attract, Bubble, Grab, Connect with force (10-200) and smooth (1-50)
- **Click Effects**: Push, Remove, Repulse, Attract, Bubble
- **Parallax**: Depth effects for enhanced interactivity

### **Connections & Modes**
- **Connection Distance**: Maximum connection radius (50-200)
- **Connection Opacity**: Link transparency (0.1-1.0)
- **Grab Distance**: Hover interaction radius (50-300)
- **Bubble Distance & Size**: Bubble effect parameters (100-600, 10-100)
- **Repulse Distance & Force**: Repulsion behavior (50-400, 0.1-2.0)

## 🎨 Professional Presets

### **Basic** - Clean, minimal particle field
### **Snow** - Gentle falling snowflakes with twinkle
### **Rainbow** - Colorful, vibrant particle system
### **Network** - Connected network visualization
### **Bubbles** - Floating bubble effect
### **Matrix** - Digital rain effect
### **Galaxy** - Cosmic star field with attraction
### **Neon** - Bright, energetic neon particles

## 🔧 Technical Details

### **Performance Optimizations**
- Efficient canvas rendering with `requestAnimationFrame`
- Smart particle physics calculations
- Memory management and cleanup
- Conditional rendering for inactive features

### **Browser Compatibility**
- Modern browsers with Canvas API support
- Responsive design for all screen sizes
- Touch device support for mobile interactions

### **Framer Integration**
- Native Framer plugin architecture
- Seamless canvas integration
- Property controls for all settings
- Live preview with real-time updates

## 🎯 Best Practices

1. **Performance**: Use 50-100 particles for mobile devices
2. **Accessibility**: Provide option to disable animations for motion-sensitive users
3. **Design**: Use particle effects to enhance, not distract from content
4. **Interactions**: Balance hover effects for smooth user experience

## 🐛 Troubleshooting

**Particles not showing?**
- Check that Amount > 0
- Verify background color contrast
- Ensure opacity > 0

**Performance issues?**
- Reduce particle amount
- Disable complex hover effects
- Use simpler boundary behaviors

**Hover not working?**
- Enable "Hover Effects" in controls
- Check interaction distance settings
- Verify force and smooth parameters

## 📝 Changelog

### v1.2.0 (Latest)
- ✅ Complete particle system with 50+ controls
- ✅ Professional preset library (8 presets)
- ✅ Advanced physics (gravity, spin, vibration, attraction)
- ✅ Multi-color palette with visual editor
- ✅ Live preview with real-time updates
- ✅ Dark mode support
- ✅ Create/Edit modes for workflow
- ✅ Comprehensive interaction system
- ✅ Boundary behavior controls
- ✅ Trail and connection effects

### v1.1.0
- ✅ Enhanced hover interactions
- ✅ Improved color handling
- ✅ Performance optimizations

### v1.0.0
- ✅ Initial release with basic particle system

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

© 2025 Mojave Studio LLC - All Rights Reserved

This is proprietary software. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## 🌟 Support

- **Documentation**: [Full Documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/mojave-particles/issues)
- **Contact**: info@mojavestud.io

---

Built with ❤️ for the Framer community by Mojave Studio 