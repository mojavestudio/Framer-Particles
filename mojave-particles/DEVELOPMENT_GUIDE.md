# 🚀 Framer Plugin Development Guide

## 📋 Development Setup

### **Local Development (Recommended)**

1. **Start Development Server:**
   ```bash
   npm run dev
   ```
   This starts Vite on `https://localhost:5173/` (port 5173 is required for Framer)

2. **Load in Framer:**
   - Open Framer → Plugins → Developer Tools
   - Load plugin with: `https://localhost:5173/`
   - The plugin will use the source files for live development

3. **Development Workflow:**
   - Make changes to `src/plugin.tsx`
   - Changes auto-reload in Framer
   - Test all functionality in real-time

### **Production Testing (AWS)**

1. **Build and Deploy:**
   ```bash
   npm run build && node aws-deploy.js
   ```

2. **Test Production Build:**
   - Load plugin with: `https://localhost:5173/` (still uses local dev server)
   - The plugin will load the production build from AWS
   - Verify everything works with optimized code

## 🔧 Current Configuration

### **Development (framer.json):**
```json
{
  "id": "a1b2c3",
  "name": "Mojave Particles Pro",
  "description": "Professional particle system with copy protection",
  "version": "1.2.0",
  "author": "Mojave Studio LLC",
  "modes": ["canvas", "sidebar"],
  "icon": "/icon.png",
  "main": "src/plugin.tsx"
}
```

### **Production (plugin.zip):**
```json
{
  "id": "a1b2c3",
  "name": "Mojave Particles Pro",
  "description": "Professional particle system with copy protection",
  "version": "1.2.0",
  "author": "Mojave Studio LLC",
  "modes": ["canvas", "sidebar"],
  "icon": "/icon.png",
  "main": "dist/index.html"
}
```

## 🎯 Development Commands

### **Local Development:**
```bash
npm run dev          # Start development server (https://localhost:5173/ - port 5173 required)
npm run lint         # Check code quality
npm run build        # Build for production
npm run preview      # Preview production build
```

### **Production Deployment:**
```bash
npm run build        # Build optimized version
node aws-deploy.js   # Deploy to AWS S3
npm run pack         # Create plugin.zip for marketplace
```

### **Testing:**
```bash
# Test local development
npm run dev
# Load in Framer: https://localhost:5173/

# Test production build
npm run build && node aws-deploy.js
# Load in Framer: https://localhost:5173/ (still local, but uses AWS files)
```

## 📦 Publishing Process

### **1. Local Development:**
- Use `npm run dev` for live development
- Test all features thoroughly
- Fix any issues

### **2. Production Build:**
- Run `npm run build` to create optimized build
- Test the production build locally
- Deploy to AWS: `node aws-deploy.js`

### **3. Marketplace Submission:**
- Create plugin package: `npm run pack`
- Upload `plugin.zip` to Framer Marketplace
- Fill in plugin details and submit

## 🌐 URLs

### **Development:**
- **Local Server**: `https://localhost:5173/` (port 5173 required)
- **Plugin URL for Framer**: `https://localhost:5173/`
- **Main File**: `src/plugin.tsx` (source code)

### **Production:**
- **AWS S3**: `https://mojave-particles-plugin-110586061563.s3.us-east-1.amazonaws.com/`
- **Main File**: `dist/index.html` (built files)

## ✅ Current Status

- **✅ Development Server**: Running on `https://localhost:5173/` (port 5173 required)
- **✅ HTTPS**: Proper SSL certificate for local development
- **✅ Auto-reload**: Changes reflect immediately in Framer
- **✅ Production Build**: Available on AWS S3
- **✅ Plugin Package**: Ready for marketplace submission

## 🚀 Next Steps

1. **Test Local Development**: Load `https://localhost:5173/` in Framer (port 5173 required)
2. **Make Changes**: Edit `src/plugin.tsx` and see live updates
3. **Test Production**: Build and deploy to AWS
4. **Submit to Marketplace**: Create plugin package and upload

---

**🎯 Your plugin is ready for development! Use `https://localhost:5173/` in Framer (port 5173 required).** 