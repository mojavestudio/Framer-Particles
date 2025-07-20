# Mojave Particles - Framer Plugin

A powerful, customizable particles component for Framer with extensive animation options and Spline compatibility.

![Particles Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Mojave+Particles+Demo)

## Features

- 🎨 **Extensive Customization**: Control particle count, size, opacity, colors, and movement
- 🎯 **Multiple Animation Modes**: Static, animated, and interactive particles
- 🔗 **Particle Links**: Connect particles with customizable lines
- 🎮 **Interactive Effects**: Click and hover interactions with various modes
- 🎪 **Spline Compatibility**: Canvas mode for embedding in Spline projects
- ⚡ **Performance Optimized**: Efficient rendering with configurable FPS
- 🎛️ **Rich Controls**: 50+ customizable properties via Framer's property panel

## Installation

### For Framer Users

1. **Install from Framer Community** (Recommended)
   - Open Framer
   - Go to the Community tab
   - Search for "Mojave Particles"
   - Click "Add to Project"

2. **Manual Installation**
   - Download the plugin files
   - Place `particles.tsx` in your Framer project's components folder
   - Import and use in your project

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/mojave-particles.git

# Install dependencies
npm install

# Start development server
npm start
```

## Quick Start

### Basic Usage

```tsx
import { MojaveParticles } from "./particles"

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

### Advanced Configuration

```tsx
<MojaveParticles
  // Basic Settings
  amount={100}
  color="#00ff88"
  colors={["#ff0088", "#00ff88", "#0088ff"]}
  backdrop="#0a0a0a"
  
  // Particle Properties
  size={{ type: "Range", min: 1, max: 5 }}
  opacity={{ type: "Range", min: 0.3, max: 0.8 }}
  
  // Movement
  move={{
    enable: true,
    speed: 3,
    direction: "none",
    random: true,
    out: "bounce"
  }}
  
  // Links
  links={{
    enable: true,
    color: "#ffffff",
    opacity: 0.4,
    distance: 150,
    width: 1
  }}
  
  // Interactions
  click={{ enable: true, mode: "push" }}
  hover={{ enable: true, mode: "grab" }}
  
  // Special Modes
  splineMode={false}
  previewAnimation={true}
/>
```

## Property Controls

### Basic Settings
- **Background**: Set the background color
- **Color**: Primary particle color
- **Colors**: Array of colors for multi-colored particles
- **Amount**: Number of particles (0-300)
- **FPS**: Animation frame rate (30, 60, 120)

### Particle Properties
- **Size**: Fixed value or range with min/max
- **Opacity**: Fixed value or range with min/max
- **Shape**: Circle, square, triangle, polygon, star, etc.
- **Density**: Control particle distribution

### Movement
- **Enable**: Toggle particle movement
- **Speed**: Movement velocity
- **Direction**: Movement direction (none, top, right, etc.)
- **Random**: Random movement patterns
- **Out Mode**: Behavior at canvas edges
- **Gravity**: Add gravitational effects
- **Spin**: Rotational movement
- **Attract**: Magnetic attraction effects

### Links
- **Enable**: Connect particles with lines
- **Color**: Link color
- **Opacity**: Link transparency
- **Distance**: Maximum connection distance
- **Width**: Link thickness

### Interactions
- **Click**: Mouse click effects (push, remove, repulse, etc.)
- **Hover**: Mouse hover effects (grab, bubble, repulse, etc.)
- **Parallax**: Hover parallax effects

### Special Modes
- **Spline Mode**: Canvas rendering for Spline compatibility
- **Test Mode**: Show particles in Framer canvas
- **Preview Animation**: Toggle between static and animated preview

## Modes & Environments

### Canvas Mode
- **Static Preview**: Particles remain stationary (good for performance)
- **Animated Preview**: Particles move and bounce (full animation)
- **Spline Compatibility**: Optimized for embedding in Spline projects

### tsParticles Mode
- **Full Features**: All advanced features available
- **Interactive**: Complete click and hover interactions
- **Performance**: Optimized rendering with configurable FPS

## Examples

### Floating Particles
```tsx
<MojaveParticles
  amount={30}
  color="#ffffff"
  backdrop="#000000"
  size={{ type: "Range", min: 2, max: 6 }}
  opacity={{ type: "Range", min: 0.4, max: 0.8 }}
  move={{
    enable: true,
    speed: 1.5,
    direction: "none",
    random: true,
    out: "bounce"
  }}
  links={{ enable: false }}
/>
```

### Connected Network
```tsx
<MojaveParticles
  amount={80}
  color="#00ff88"
  backdrop="#0a0a0a"
  size={{ type: "Value", value: 3 }}
  opacity={{ type: "Value", value: 0.6 }}
  move={{
    enable: true,
    speed: 2,
    direction: "none",
    out: "out"
  }}
  links={{
    enable: true,
    color: "#00ff88",
    opacity: 0.3,
    distance: 120,
    width: 1
  }}
  hover={{ enable: true, mode: "grab" }}
/>
```

### Interactive Explosion
```tsx
<MojaveParticles
  amount={100}
  color="#ff0088"
  backdrop="#1a1a1a"
  size={{ type: "Range", min: 1, max: 8 }}
  opacity={{ type: "Range", min: 0.2, max: 1 }}
  move={{
    enable: true,
    speed: 4,
    direction: "outside",
    random: true,
    out: "destroy"
  }}
  click={{ enable: true, mode: "push" }}
  hover={{ enable: true, mode: "bubble" }}
/>
```

## Spline Integration

For use in Spline projects:

1. Enable **Spline Mode** in the property controls
2. Set **Preview Animation** to your preference
3. Copy the component to your Spline project
4. The particles will render using canvas for maximum compatibility

## Performance Tips

- **Lower FPS**: Use 30 FPS for better performance on slower devices
- **Fewer Particles**: Reduce amount for smoother animation
- **Disable Links**: Turn off particle connections for better performance
- **Static Mode**: Use static preview for complex scenes
- **Optimize Size**: Use smaller particle sizes for better performance

## Troubleshooting

### Particles Not Showing
- Check that `amount` is greater than 0
- Verify `opacity` is not set to 0
- Ensure the component has sufficient height/width

### Performance Issues
- Reduce particle count
- Lower FPS setting
- Disable particle links
- Use static preview mode

### Spline Compatibility
- Enable Spline Mode
- Test in Spline's preview environment
- Adjust particle count for better performance

## Development

### Project Structure
```
mojave-particles/
├── particles.tsx          # Main component
├── package.json           # Dependencies and metadata
├── README.md             # Documentation
├── test-particles.html   # Test page
└── .gitignore           # Git ignore rules
```

### Building
```bash
# Install dependencies
npm install

# Start development
npm start

# Build for production
npm run build

# Publish to Framer
npm run publish
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mojave-particles/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mojave-particles/discussions)
- **Documentation**: [Full Documentation](https://github.com/yourusername/mojave-particles/wiki)

## Changelog

### v1.0.0
- Initial release
- Basic particle system with customization
- Spline compatibility mode
- Interactive effects (click/hover)
- Property controls for Framer

---

Made with ❤️ for the Framer community 