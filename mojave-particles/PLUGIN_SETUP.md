# 🚀 Framer Plugin Development Setup Guide

**Mojave Particles Pro v1.2.0** - Plugin Development Environment

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Framer Desktop App** (latest version)
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **NPM or Yarn** package manager
- ✅ **Valid Commercial License** for Mojave Particles Pro

## 🛠️ Step 1: Enable Developer Tools in Framer

1. **Open Framer Desktop Application**
2. **Navigate to Main Menu**:
   - **macOS**: Click **Framer** in the menu bar
   - **Windows**: Click the **hamburger menu** (☰)
3. **Go to Plugins** → **Developer Tools**
4. **Enable the checkbox** ✅

![Enable Developer Tools](https://your-docs-site.com/images/enable-dev-tools.png)

## 🔧 Step 2: Setup Development Environment

### Clone/Download the Plugin

```bash
# Navigate to your development directory
cd ~/Development/framer-plugins

# If you have the plugin package, extract it here
# The folder should be named 'mojave-particles'
```

### Install Dependencies

```bash
cd mojave-particles
npm install
```

### Verify Configuration

Check that these files exist:
- ✅ `framer.json` - Plugin manifest
- ✅ `particles.tsx` - Main component
- ✅ `package.json` - Dependencies
- ✅ `vite.config.ts` - Build configuration

## 🚀 Step 3: Start Development Server

### Option A: Using NPM Script (Recommended)

```bash
npm run dev:plugin
```

### Option B: Manual Vite Command

```bash
npx vite
```

You should see output like:
```
🚀 Starting Framer Plugin Development Server...

  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

**⚠️ Keep this terminal window open** - the dev server must run continuously.

## 🎯 Step 4: Load Plugin in Framer

### Open Development Plugin

1. **Open Framer Desktop**
2. **Create a new project** or open existing one
3. **Click the Plugins button** in the top toolbar
4. **Select "Open Development Plugin"** from the dropdown

![Open Development Plugin](https://your-docs-site.com/images/open-dev-plugin.png)

### Navigate to Plugin Folder

1. **File browser will open**
2. **Navigate to** your `mojave-particles` folder
3. **Select the folder** (not individual files)
4. **Click "Open"**

## ✅ Step 5: Verify Plugin Loading

### Success Indicators

If everything is working correctly:

- ✅ **Plugin appears** in the Framer canvas
- ✅ **Property controls** visible in right panel
- ✅ **Particles render** on the canvas
- ✅ **No console errors** in browser dev tools

### Plugin Interface

You should see these property controls:

- 🎨 **Background**: Color picker for backdrop
- 🌈 **Color/Colors**: Particle color options
- 🔢 **Amount**: Slider (0-300 particles)
- 📏 **Size**: Value or Range options
- 👻 **Opacity**: Value or Range options
- ✨ **Twinkle**: Enable/disable with settings
- 🏃 **Move**: Movement configuration
- 🖱️ **Hover**: Interactive effects
- 🎭 **Modes**: Effect parameters

## 🔄 Step 6: Live Development Workflow

### Auto-Reload Feature

- **Save any file** in the plugin directory
- **Framer automatically reloads** the plugin
- **Changes appear instantly** on canvas

### Development Tips

1. **Keep Dev Tools Open**: Press `F12` or `Cmd+Opt+I` to monitor console
2. **Test All Properties**: Verify each control works as expected
3. **Test Interactions**: Try hover effects and animations
4. **Performance Monitoring**: Watch for frame drops or lag

## 🧪 Step 7: Testing Checklist

### Basic Functionality
- [ ] Plugin loads without errors
- [ ] Particles render on canvas
- [ ] Property controls respond correctly
- [ ] Background color changes work
- [ ] Particle count adjusts properly

### Animation Testing
- [ ] Movement animations work smoothly
- [ ] Hover effects respond to mouse
- [ ] Twinkle/pulse effects function
- [ ] Time limits and looping work
- [ ] Boundary bouncing works correctly

### Performance Testing
- [ ] 30-50 particles run smoothly
- [ ] 100+ particles perform acceptably
- [ ] No memory leaks during extended use
- [ ] CPU usage remains reasonable

### Compatibility Testing
- [ ] Works in different Framer projects
- [ ] Property controls display correctly
- [ ] Canvas rendering is crisp
- [ ] Colors display accurately

## 🐛 Troubleshooting

### Plugin Not Loading

**Problem**: Plugin doesn't appear in Framer
**Solutions**:
- ✅ Verify dev server is running (`http://localhost:3000`)
- ✅ Check Developer Tools are enabled
- ✅ Ensure you selected the correct folder
- ✅ Restart Framer Desktop app

### Canvas Not Rendering

**Problem**: Plugin loads but no particles visible
**Solutions**:
- ✅ Check browser console for errors
- ✅ Verify `amount` property is > 0
- ✅ Ensure colors have sufficient contrast
- ✅ Check opacity settings aren't too low

### Property Controls Missing

**Problem**: Right panel doesn't show controls
**Solutions**:
- ✅ Verify `addPropertyControls` is properly configured
- ✅ Check for TypeScript/JavaScript errors
- ✅ Ensure framer import is working
- ✅ Restart the development server

### Performance Issues

**Problem**: Animations are choppy or slow
**Solutions**:
- ✅ Reduce particle count
- ✅ Disable complex hover effects
- ✅ Check system resources
- ✅ Test with different browsers

## 🏗️ Step 8: Building for Distribution

### Development Build (Unobfuscated)

```bash
npm run build:dev
```

### Production Build (Obfuscated)

```bash
npm run build
```

### Package for Distribution

```bash
npm run pack
```

This creates a `plugin.zip` file ready for distribution.

## 📝 Development Notes

### File Structure
```
mojave-particles/
├── framer.json         # Plugin manifest
├── particles.tsx       # Main component
├── package.json        # Dependencies
├── vite.config.ts      # Build config
├── LICENSE            # Commercial license
├── README.md          # Documentation
└── dist/              # Built files
```

### Security Features

- 🔒 **Code Obfuscation**: Production builds are minified and obfuscated
- 🛡️ **License Verification**: Runtime checks for authorized usage
- 🚫 **Anti-Tampering**: Protection against unauthorized modifications

### Version Control

Always update these when making changes:
- `package.json` version number
- `framer.json` version number
- Copyright headers in source files
- `CHANGELOG.md` entries

## 🆘 Getting Help

### Support Channels
- **📧 Email**: info@mojavestud.io
- **📚 Documentation**: https://docs.mojavestud.io
- **🎮 Discord**: https://discord.gg/mojavestudio

### Before Contacting Support
1. ✅ Check this setup guide
2. ✅ Review the troubleshooting section
3. ✅ Test with a fresh Framer project
4. ✅ Verify your license is valid

---

**🌟 Signature**: `MOJAVE_PARTICLES_DEVELOPMENT_GUIDE_v1.2.0`

**Happy Plugin Development!** 🚀 