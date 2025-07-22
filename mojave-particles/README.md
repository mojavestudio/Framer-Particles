# 🌟 Mojave Particles

A powerful, lightweight particle system component for Framer with advanced animations and interactive effects.

![Mojave Particles Demo](https://img.shields.io/badge/Framer-Component-blue?style=for-the-badge&logo=framer)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

### 🎨 **Visual Customization**
- **Multiple Colors**: Single color or color arrays with random selection
- **Size Control**: Fixed values or dynamic ranges for varied particle sizes
- **Opacity Control**: Fixed, range-based, or random opacity values
- **Background Opacity**: Perfect for layering multiple particle components
- **Border Radius**: Rounded corners for container styling

### 🎭 **Animation Effects**
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

### 🚀 **Performance & Compatibility**
- **Pure Canvas Rendering**: Maximum compatibility across all browsers
- **Hardware Acceleration**: GPU-accelerated for smooth performance
- **Optimized**: Clean, lightweight codebase (37kB minified)
- **No Dependencies**: No external libraries required
- **TypeScript**: Full type safety and IntelliSense support

## 🚀 Installation

### For Framer Projects

1. **Download** the `mojave-particles` folder
2. **Add** it to your Framer project directory
3. **Import** and use the component

### For React/Next.js Projects

```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git

# Copy the particles.tsx file to your components folder
cp mojave-particles/particles.tsx src/components/
```

## 🎛️ Usage

### Basic Usage

```tsx
import MojaveParticles from "./mojave-particles/particles"

export default function MyComponent() {
    return (
        <MojaveParticles 
            amount={100}
            color="#ffffff"
            backdrop="#141414"
        />
    )
}
```

### Advanced Configuration

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
    modes={{
        repulse: 150,
        grab: 120,
        bubble: 200,
        bubbleSize: 50
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

### Layering Multiple Components

```tsx
// Bottom layer - opaque background
<MojaveParticles 
    amount={50}
    color="#ffffff"
    backdrop="#141414"
    backgroundOpacity={1}
/>

// Top layer - transparent background
<MojaveParticles 
    amount={30}
    colors={["#ff6b6b", "#ffd93d"]}
    backgroundOpacity={0}
    move={{ speed: 1 }}
/>
```

## 🎨 Property Reference

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `amount` | `number` | `50` | Number of particles (0-300) |
| `color` | `Color` | `"#ffffff"` | Primary particle color |
| `colors` | `Color[]` | `[]` | Array of colors for multi-colored particles |
| `backdrop` | `Color` | `"#141414"` | Background color |
| `backgroundOpacity` | `number` | `1` | Background opacity (0-1) |
| `radius` | `number` | `0` | Border radius for container |

### Size & Opacity

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `{type: "Value"\|"Range", value?: number, min?: number, max?: number}` | `{type: "Range", min: 1, max: 5}` | Particle size configuration |
| `opacity` | `{type: "Value"\|"Range", value?: number, min?: number, max?: number}` | `{type: "Range", min: 0.1, max: 1}` | Particle opacity configuration |

### Movement

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `move` | `{enable: boolean, speed: number, timeLimit?: number, loopAnimation?: boolean}` | `{enable: true, speed: 2}` | Movement configuration |

### Hover Effects

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hover` | `{enable: boolean, mode: "repulse"\|"grab"\|"bubble"}` | `{enable: true, mode: "grab"}` | Hover interaction settings |
| `modes` | `{repulse: number, grab: number, bubble: number, bubbleSize: number}` | Various | Interaction distances and effects |

### Twinkle Effect

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `twinkle` | `{enable: boolean, speed: number, minOpacity: number, maxOpacity: number}` | `{enable: false, speed: 1, minOpacity: 0.1, maxOpacity: 1}` | Pulsing effect configuration |

## 🎯 Examples

### Starfield Effect
```tsx
<MojaveParticles 
    amount={200}
    colors={["#ffffff", "#ffff99", "#99ccff"]}
    size={{ type: "Range", min: 1, max: 3 }}
    twinkle={{ enable: true, speed: 0.8, minOpacity: 0.2, maxOpacity: 1 }}
    move={{ enable: false }}
    backdrop="transparent"
    backgroundOpacity={0}
/>
```

### Interactive Network
```tsx
<MojaveParticles 
    amount={80}
    color="#00ff88"
    hover={{ enable: true, mode: "grab" }}
    modes={{ grab: 140, grabLinks: 1 }}
    move={{ enable: true, speed: 1.5 }}
/>
```

### Floating Bubbles
```tsx
<MojaveParticles 
    amount={40}
    colors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]}
    size={{ type: "Range", min: 5, max: 15 }}
    opacity={{ type: "Range", min: 0.4, max: 0.8 }}
    move={{ enable: true, speed: 0.8 }}
    hover={{ enable: true, mode: "bubble" }}
    modes={{ bubble: 250, bubbleSize: 25 }}
/>
```

## 🛠️ Development

### Building

```bash
npm install
npm run build
```

### Development Server

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

## 🎨 Customization Tips

1. **Performance**: Use fewer particles (50-100) for mobile devices
2. **Battery Life**: Lower speeds (1-2) for background animations
3. **Layering**: Use `backgroundOpacity: 0` for transparent overlays
4. **Interactions**: Combine multiple hover modes for rich effects
5. **Colors**: Use color arrays for dynamic, multi-colored effects

## 🐛 Troubleshooting

**Particles not showing?**
- Check that `amount > 0`
- Verify background color contrast
- Ensure `opacity > 0`

**Performance issues?**
- Reduce particle amount
- Lower movement speed
- Disable complex hover effects

**Layering not working?**
- Set `backgroundOpacity: 0` on top layers
- Use different particle amounts for visual separation

## 📝 Changelog

### v1.0.0
- ✅ Pure canvas rendering for maximum compatibility
- ✅ Background opacity control for layering
- ✅ Hardware acceleration for smooth performance
- ✅ Comprehensive hover interactions
- ✅ Twinkle/pulse animation effects
- ✅ Time-limited animations with looping
- ✅ Clean, optimized codebase
- ✅ Full TypeScript support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for the Framer community.

- [Framer](https://framer.com) - For the amazing design tool
- Canvas API - For hardware-accelerated rendering
- TypeScript - For type safety and developer experience

---

**Made by [Your Name]** | **[GitHub](https://github.com/your-username)** | **[Twitter](https://twitter.com/your-username)** 