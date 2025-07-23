# 🌟 Mojave Particles Pro

A professional-grade particle system plugin for Framer with advanced animations, physics, and interactive effects. Features clean component generation, professional branding, and full AWS deployment infrastructure.

## 📁 Repository Structure

```
particles/
├── mojave-particles/          # Main Framer plugin
│   ├── src/                   # Plugin source code
│   ├── dist/                  # Built plugin files
│   ├── README.md              # Detailed plugin documentation
│   ├── package.json           # Plugin dependencies and scripts
│   └── framer.json           # Framer plugin configuration
├── .github/                   # GitHub Actions workflows
├── setup-github-actions.sh   # GitHub Actions setup script
└── README.md                 # This file
```

## 🚀 Quick Start

### For Framer Users
1. Install the plugin from the Framer Plugin Store
2. Add to your canvas and customize with the intuitive controls
3. Use presets for instant professional effects

### For Developers
```bash
# Clone the repository
git clone https://github.com/your-username/mojave-particles.git
cd mojave-particles/mojave-particles

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Plugin will be available at https://localhost:5173/
```

## ✨ Key Features

- **Clean Component Generation**: ~100 line components instead of 2000+ line dumps
- **Professional Branding**: Comprehensive copyright and mojavestud.io integration
- **AWS Infrastructure**: Complete CI/CD pipeline with GitHub Actions
- **8 Professional Presets**: Network, Bubbles, Matrix, Galaxy, Neon, and more
- **Advanced Physics**: Gravity, spin, vibration, attraction effects
- **Interactive Effects**: Hover, click, and connection systems
- **Live Preview**: Real-time preview in plugin window
- **Dark Mode Support**: Automatic theme detection

## 📚 Documentation

- **[Main Plugin Documentation](mojave-particles/README.md)** - Complete feature guide and API reference
- **[AWS Deployment Guide](mojave-particles/AWS_DEPLOYMENT.md)** - CloudFormation and CI/CD setup
- **[GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md)** - Automated deployment configuration
- **[Framer Publishing Guide](mojave-particles/FRAMER_PUBLISHING.md)** - Marketplace submission process
- **[Development Guide](mojave-particles/DEVELOPMENT_GUIDE.md)** - Local development setup

## 🔄 Deployment Options

### 1. Local Development
```bash
cd mojave-particles
npm run dev
# Available at https://localhost:5173/
```

### 2. AWS Production Deployment
```bash
# Setup infrastructure
./setup-aws.sh --deploy-infra

# Deploy plugin
cd mojave-particles
npm run deploy
```

### 3. GitHub Actions (Automated)
```bash
# Setup CI/CD pipeline
./setup-github-actions.sh

# Automatic deployment on push to main
git push origin main
```

## 🎨 Preview

### Plugin Interface
- Clean, professional UI with #000005 background matching logo
- Live particle preview with real-time updates
- Intuitive preset selection and customization controls
- Professional copyright footer

### Generated Components
- Streamlined React components (~100 lines)
- Professional copyright headers
- mojavestud.io branding and contact information
- Clean canvas rendering without overlays

## 📝 Latest Updates (v1.2.1)

- ✅ **Clean Component Generation**: Eliminated 2000+ line code dumps
- ✅ **Professional Branding**: Added comprehensive copyright and contact info
- ✅ **Website Integration**: https://mojavestud.io/particles for support
- ✅ **Custom UI Styling**: Plugin background matches logo PNG
- ✅ **AWS Infrastructure**: Complete CI/CD with CloudFormation
- ✅ **Marketplace Ready**: Professional packaging scripts

## 🌟 Support

- **Website**: [https://mojavestud.io/particles](https://mojavestud.io/particles) - Feature requests and questions
- **Documentation**: [mojave-particles/README.md](mojave-particles/README.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/mojave-particles/issues)
- **Contact**: info@mojavestud.io

---

Copyright Mojave Studio 2025 - mojavestud.io - Custom Automated Web Design experts

Built with ❤️ for the Framer community 