# 🌟 Mojave Particles

A powerful, customizable particle system component for Framer with advanced animations and effects.

## ✨ Features

### 🎨 **Dual Rendering Modes**
- **Spline Mode**: Optimized canvas rendering for Spline compatibility with full hover interactions
- **Standard Mode**: High-performance tsParticles rendering for regular Framer usage

### 🎭 **Particle Customization**
- **Colors**: Single color or multiple color arrays with automatic random selection
- **Size**: Fixed values or dynamic ranges for varied particle sizes
- **Opacity**: Fixed, range-based, or random opacity values
- **Amount**: Control particle density (1-500 particles)

### ✨ **Animation Effects**
- **Movement**: Configurable speed, direction, and physics
- **Twinkle/Pulse**: Beautiful pulsing opacity effects with customizable speed and range
- **Time Limits**: Set animation duration with perfect looping or stop options
- **Boundary Physics**: Particles bounce naturally off edges

### 🎯 **Interactive Hover Effects**
- **Repulse**: Particles move away from cursor
- **Attract**: Particles are drawn toward cursor  
- **Bubble**: Particles grow when hovered
- **Grab**: Draw connecting lines to nearby particles
- **Connect**: Show connections between all nearby particles
- **Trail**: Particles leave trails following the cursor

### 🎨 **Visual Customization**
- **Background**: Custom backdrop colors
- **Particle Links**: Optional connecting lines between particles
- **Border Radius**: Rounded corners for container
- **FPS Control**: 30, 60, or 120 FPS options

## 🚀 Installation

1. Download the `mojave-particles` folder
2. Add it to your Framer project
3. Import and use the component

```tsx
import MojaveParticles from "./mojave-particles/particles"

// Use in your Framer component
<MojaveParticles 
    amount={100}
    splineMode={false}
    twinkle={{ enable: true, speed: 1.5 }}
/>
```

## 🎛️ Property Controls

### **Core Settings**
- **Spline Mode**: Enable for Spline compatibility (uses canvas rendering)
- **Amount**: Number of particles (1-500)
- **FPS**: Frame rate (30/60/120)
- **Background**: Backdrop color

### **Appearance**
- **Color**: Primary particle color
- **Colors**: Array of colors for multi-colored particles
- **Size**: Fixed value or min/max range
- **Opacity**: Fixed value, range, or random

### **Twinkle Effect** ✨
- **Enable**: Turn twinkle/pulse effect on/off
- **Speed**: Animation speed (0.1-5)
- **Min Opacity**: Minimum opacity during pulse
- **Max Opacity**: Maximum opacity during pulse

### **Movement**
- **Enable**: Turn particle movement on/off
- **Speed**: Movement speed (0-50)
- **Direction**: Movement direction (none/top/bottom/left/right)
- **Time Limit**: Animation duration in seconds (0 = infinite)
- **Loop Animation**: Whether to loop or stop after time limit

### **Hover Interactions**
- **Enable**: Turn hover effects on/off
- **Mode**: Repulse, Attract, Bubble, Grab, Connect, or Trail
- **Distance**: Interaction radius
- **Various mode-specific settings**

### **Links**
- **Enable**: Show connecting lines between particles
- **Color**: Link color
- **Opacity**: Link transparency
- **Distance**: Maximum connection distance
- **Width**: Line thickness

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
    links={{ enable: true, distance: 120 }}
    hover={{ 
        enable: true, 
        mode: "grab", 
        distance: 150 
    }}
/>
```

### Spline-Compatible Setup
```tsx
<MojaveParticles 
    splineMode={true}
    amount={75}
    hover={{ 
        enable: true, 
        mode: "repulse", 
        distance: 100 
    }}
/>
```

## 🔧 Technical Details

### **Rendering Modes**
- **Canvas Mode**: Direct canvas rendering for maximum compatibility
- **tsParticles Mode**: WebGL-accelerated rendering for performance

### **Performance**
- Optimized animation loops with `requestAnimationFrame`
- Efficient particle physics calculations
- Smart cleanup and memory management
- FPS limiting for battery conservation

### **Color Support**
- Hex colors (`#ffffff`)
- RGB/RGBA values
- Framer Color objects
- Framer Design Tokens (`var(--token-...)`)

## 🎯 Best Practices

1. **For Spline Projects**: Enable Spline Mode for full compatibility
2. **Performance**: Use fewer particles (50-100) for mobile devices
3. **Battery Life**: Lower FPS (30) for background animations
4. **Accessibility**: Provide option to disable animations for users with motion sensitivity

## 🐛 Troubleshooting

**Particles not showing?**
- Check that Amount > 0
- Verify background color contrast
- Ensure opacity > 0

**Performance issues?**
- Reduce particle amount
- Lower FPS setting
- Disable complex hover effects

**Hover not working?**
- Enable "Hover" in controls
- Try enabling Spline Mode
- Check interaction distance settings

## 📝 Changelog

### Latest Version
- ✅ Added Twinkle/Pulse animation effects
- ✅ Simplified mode selection (just Spline Mode toggle)
- ✅ Fixed animation stopping after 5 seconds
- ✅ Improved color handling for Framer Design Tokens
- ✅ Enhanced hover interactions for all modes
- ✅ Optimized loop reset performance
- ✅ Added time limit and looping controls

---

Built with ❤️ for the Framer community 