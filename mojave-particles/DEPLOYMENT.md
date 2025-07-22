# 🚀 Deployment Guide - Mojave Particles Pro

This guide covers deploying the Mojave Particles plugin for both local development and AWS production hosting.

## 📋 Prerequisites

### **For Local Development**
- Node.js 18+ and npm 8+
- Framer account with Developer Tools enabled
- HTTPS support (handled by `vite-plugin-mkcert`)

### **For AWS Deployment**
- AWS account with appropriate permissions
- GitHub repository for automatic deployments
- Domain name (optional but recommended)

## 🏠 Local Development Setup

### **Quick Start**
```bash
# Clone and setup
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### **Load in Framer**
1. **Open Framer**
2. **Go to Plugins** → **Developer Tools** (enable if not already)
3. **Click "Open Development Plugin"**
4. **Enter URL**: `https://localhost:5173`
5. **Click "Load"**

### **Development Workflow**
```bash
# Start development
npm run dev

# Make changes to src/plugin.tsx
# Changes auto-reload in Framer

# Test functionality
# Load plugin in Framer and test all features
```

## ☁️ AWS Production Deployment

### **Method 1: GitHub Pages (Recommended)**

#### **Setup GitHub Pages**
1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "feat: Complete Mojave Particles plugin"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`
   - Click "Save"

3. **Configure for Framer Plugin**
   - GitHub Pages will serve from: `https://your-username.github.io/mojave-particles/`
   - Update `framer.json` if needed for production

#### **Build for Production**
```bash
# Build the plugin
npm run build

# The build output will be in the dist/ folder
# GitHub Pages will serve this automatically
```

### **Method 2: AWS S3 + CloudFront**

#### **Setup S3 Bucket**
```bash
# Create S3 bucket
aws s3 mb s3://mojave-particles-plugin

# Configure for static website hosting
aws s3 website s3://mojave-particles-plugin --index-document index.html --error-document index.html
```

#### **Deploy to S3**
```bash
# Build the plugin
npm run build

# Deploy to S3
aws s3 sync dist/ s3://mojave-particles-plugin --delete

# Make files publicly readable
aws s3 sync dist/ s3://mojave-particles-plugin --delete --acl public-read
```

#### **Setup CloudFront (Optional but Recommended)**
1. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: `index.html`

2. **Configure Custom Domain (Optional)**
   - Add custom domain in CloudFront
   - Configure SSL certificate via AWS Certificate Manager

### **Method 3: Vercel Deployment**

#### **Setup Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### **Configure for Framer**
- Vercel will provide a URL like: `https://mojave-particles.vercel.app`
- Use this URL in Framer's Developer Tools

## 🔧 Production Configuration

### **Update framer.json for Production**
```json
{
  "id": "a1b2c3",
  "name": "Mojave Particles Pro",
  "description": "Professional particle system with copy protection",
  "version": "1.2.0",
  "author": "Mojave Studio LLC",
  "modes": ["canvas"],
  "icon": "/icon.png",
  "main": "src/plugin.tsx"
}
```

### **Environment Variables**
```bash
# For production builds
NODE_ENV=production
VITE_PLUGIN_URL=https://your-production-domain.com
```

### **Build Configuration**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), mkcert(), framer()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: true,
    cors: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    include: ['framer-plugin']
  }
})
```

## 🔐 Security & Performance

### **HTTPS Requirements**
- **Local Development**: `vite-plugin-mkcert` provides SSL certificates
- **Production**: CloudFront/Vercel/GitHub Pages provide HTTPS
- **Framer Requirement**: All plugin URLs must be HTTPS

### **CORS Configuration**
```typescript
// vite.config.ts
server: {
  cors: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
}
```

### **Performance Optimization**
- **Code Splitting**: Vite handles automatic code splitting
- **Tree Shaking**: Unused code is automatically removed
- **Asset Optimization**: Images and assets are optimized
- **Caching**: CloudFront provides edge caching

## 📊 Monitoring & Analytics

### **Error Tracking**
```javascript
// Add to plugin.tsx for production monitoring
if (process.env.NODE_ENV === 'production') {
  // Add error tracking service
  window.addEventListener('error', (event) => {
    // Send to monitoring service
    console.error('Plugin Error:', event.error);
  });
}
```

### **Usage Analytics**
```javascript
// Track plugin usage
const trackUsage = () => {
  fetch('https://your-analytics-endpoint.com/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plugin: 'mojave-particles',
      version: '1.2.0',
      timestamp: Date.now()
    })
  });
};
```

## 🚨 Troubleshooting

### **Common Deployment Issues**

#### **Plugin Won't Load in Production**
- ✅ **Check HTTPS**: URL must be HTTPS
- ✅ **Check CORS**: Ensure CORS headers are set
- ✅ **Check Build**: Verify `npm run build` succeeds
- ✅ **Check URL**: Use correct production URL in Framer

#### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install --legacy-peer-deps
npm run build
```

#### **Performance Issues**
- ✅ **Enable Compression**: Gzip/Brotli compression
- ✅ **Use CDN**: CloudFront or similar for global distribution
- ✅ **Optimize Assets**: Compress images and assets
- ✅ **Monitor Bundle Size**: Keep bundle under 1MB

### **Testing Checklist**
- [ ] ✅ Plugin loads in Framer without errors
- [ ] ✅ All presets work correctly
- [ ] ✅ Property controls function properly
- [ ] ✅ Particles render correctly on canvas
- [ ] ✅ Performance is acceptable (60fps)
- [ ] ✅ HTTPS works correctly
- [ ] ✅ CORS headers are set

## 🔄 Update Process

### **Automatic Updates (GitHub Pages)**
1. **Push changes to main branch**
2. **GitHub Pages automatically rebuilds**
3. **Users get updates automatically**

### **Manual Updates (S3/CloudFront)**
```bash
# Build new version
npm run build

# Deploy to S3
aws s3 sync dist/ s3://mojave-particles-plugin --delete --acl public-read

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 📞 Support

### **Deployment Issues**
- Check this guide first
- Verify all prerequisites are met
- Test locally before deploying
- Check browser console for errors

### **Contact**
- **Technical Issues**: GitHub Issues
- **Deployment Help**: info@mojavestud.io
- **Documentation**: See guides in repository

---

**This deployment guide ensures your Mojave Particles plugin works perfectly in both development and production environments!** 🚀 