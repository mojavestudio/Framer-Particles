# 🚀 Server Management Scripts

This directory contains convenient scripts to start and stop the Mojave Particles development environment.

## 📁 Files

- **`start-servers.sh`** - Starts the development server
- **`stop-servers.sh`** - Stops all running servers
- **`SERVER_SCRIPTS.md`** - This documentation file

## 🎯 Quick Start

### Start Development Server
```bash
./start-servers.sh
```

### Stop All Servers
```bash
./stop-servers.sh
```

## 🔧 What the Start Script Does

1. **✅ Directory Check** - Ensures you're in the correct `mojave-particles` directory
2. **📦 Dependency Installation** - Installs npm packages if `node_modules` doesn't exist
3. **🔄 Process Cleanup** - Stops any existing servers
4. **🌐 Development Server** - Starts Vite dev server on `https://localhost:5173`
5. **📊 Status Monitoring** - Continuously monitors server health
6. **🛑 Clean Shutdown** - Gracefully stops all servers on Ctrl+C

## 🌐 Server URLs

### Development Server
- **URL:** `https://localhost:5173`
- **Purpose:** Local development and Framer plugin testing
- **Status:** ✅ Running when script is active

## 📱 Framer Integration

### Load Plugin in Framer
1. Open Framer
2. Go to **Plugins** → **Developer Tools**
3. Click **"Open Development Plugin"**
4. Enter URL: `https://localhost:5173`
5. Click **"Load"**

## 🛠️ Troubleshooting

### Common Issues

#### "Permission denied" when running scripts
```bash
chmod +x start-servers.sh stop-servers.sh
```

#### Ports already in use
```bash
./stop-servers.sh
# Then run:
./start-servers.sh
```

#### Plugin won't load in Framer
1. Check browser console for errors
2. Verify URL is `https://localhost:5173` (not `http`)
3. Accept SSL certificate warnings
4. Restart Framer after enabling Developer Tools

#### Dependencies missing
```bash
npm install --legacy-peer-deps
```

### Manual Server Management

#### Check server status
```bash
lsof -i :5173  # Development server
```

#### Stop servers manually
```bash
pkill -f "vite"
```

#### Start server manually
```bash
cd mojave-particles
npm run dev
```

## 🔄 Development Workflow

### 1. Start Development
```bash
./start-servers.sh
```

### 2. Make Changes
- Edit files in `src/`
- Changes auto-reload in browser
- Test in Framer

### 3. Stop Development
```bash
./stop-servers.sh
```

## 📊 Server Status Indicators

### ✅ Server Running Successfully
```
🌐 Starting development server (https://localhost:5173)...
✅ Development server started on port 5173 (PID: xxxx)
🎉 All servers are running!
📊 Server Status:
   Development Server: https://localhost:5173 ✅
```

### ❌ Server Failed to Start
```
❌ Development server failed to start
```

**Common causes:**
- Port 5173 already in use
- Missing dependencies
- Incorrect directory
- Permission issues

## 🎯 Key Features

### **Automatic Port Detection**
- Script automatically finds available ports (5173-5177)
- No manual port configuration needed
- Handles port conflicts gracefully

### **HTTPS Support**
- Development server runs with HTTPS
- SSL certificates handled by `vite-plugin-mkcert`
- Required for Framer plugin development

### **Process Management**
- Automatically kills existing processes
- Graceful shutdown on Ctrl+C
- Process monitoring and status reporting

### **Dependency Management**
- Automatic `npm install` if dependencies missing
- Uses `--legacy-peer-deps` for compatibility
- Handles dependency conflicts

## 📝 Script Details

### **start-servers.sh**
```bash
#!/bin/bash
# Starts the Mojave Particles development environment
# Features:
# - Directory validation
# - Dependency installation
# - Process cleanup
# - Server startup
# - Status monitoring
# - Graceful shutdown
```

### **stop-servers.sh**
```bash
#!/bin/bash
# Stops all Mojave Particles servers
# Features:
# - Kills vite processes
# - Reports port status
# - Clean shutdown
```

## 🚨 Emergency Procedures

### **If Scripts Don't Work**
```bash
# Manual cleanup
pkill -f "vite"
pkill -f "node"
sleep 2

# Manual restart
cd mojave-particles
npm run dev
```

### **If Port is Stuck**
```bash
# Find process using port
lsof -i :5173

# Kill process
kill -9 $(lsof -ti:5173)

# Restart server
npm run dev
```

### **If Dependencies are Corrupted**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

## 📞 Support

### **Script Issues**
- Check file permissions: `ls -la *.sh`
- Verify you're in correct directory: `pwd`
- Check for syntax errors: `bash -n start-servers.sh`

### **Server Issues**
- Check server logs in terminal
- Verify HTTPS certificate acceptance
- Test URL in browser: `https://localhost:5173`

### **Framer Issues**
- Ensure Developer Tools are enabled
- Check Framer console for errors
- Verify plugin URL is correct

---

**These scripts provide a reliable way to manage your Mojave Particles development environment!** 🚀 