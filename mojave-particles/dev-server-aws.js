#!/usr/bin/env node

/**
 * Development Server for AWS-served Framer Plugin
 * Serves the plugin configuration that points to AWS
 */

import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 5173 // Standard Vite dev server port
const CONFIG_FILE = join(__dirname, 'framer-aws-dev.json')

console.log('🌐 Starting AWS Development Server...')
console.log('=====================================')

if (!existsSync(CONFIG_FILE)) {
  console.error('❌ framer-aws-dev.json not found!')
  process.exit(1)
}

const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'))

const server = createServer((req, res) => {
  const url = req.url
  
  console.log(`📥 ${req.method} ${url}`)
  
  // Set CORS headers for Framer
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mojave Particles Pro - AWS Dev</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .url {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
        }
        .steps {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .step {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border-left: 4px solid #2196f3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Mojave Particles Pro - AWS Development Server</h1>
        
        <div class="info">
            <strong>✅ Plugin Configuration:</strong>
            <div class="url">${JSON.stringify(config, null, 2)}</div>
        </div>
        
        <div class="steps">
            <h3>📋 How to Test in Framer:</h3>
            <div class="step">
                1. Open Framer and go to <strong>Plugins → Developer Tools</strong>
            </div>
            <div class="step">
                2. Load plugin with URL: <strong>http://localhost:${PORT}</strong>
            </div>
            <div class="step">
                3. The plugin will load the main file from AWS: <strong>${config.main}</strong>
            </div>
            <div class="step">
                4. Test all functionality and make sure it works with the production build
            </div>
        </div>
        
        <div class="info">
            <strong>🔧 Development Workflow:</strong>
            <ul>
                <li>Make changes to your code</li>
                <li>Run: <code>npm run build && node aws-deploy.js</code></li>
                <li>Refresh Framer to see changes</li>
                <li>Test thoroughly before creating plugin package</li>
            </ul>
        </div>
        
        <div class="info">
            <strong>📦 Create Plugin Package:</strong>
            <div class="step">
                When ready: <code>npm run pack</code> to create plugin.zip for marketplace
            </div>
        </div>
    </div>
</body>
</html>
    `)
  } else if (url === '/framer.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(config, null, 2))
  } else if (url === '/icon.png' || url === '/icon-dark.png') {
    // Serve icons from public directory
    const iconPath = join(__dirname, 'public', url === '/icon.png' ? 'icon.png' : 'icon-dark.png')
    if (existsSync(iconPath)) {
      const icon = readFileSync(iconPath)
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.end(icon)
    } else {
      res.writeHead(404)
      res.end('Icon not found')
    }
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ AWS Development Server running on http://localhost:${PORT}`)
  console.log(`📋 Plugin URL for Framer: http://localhost:${PORT}`)
  console.log(`🌐 Main file served from: ${config.main}`)
  console.log('')
  console.log('🔧 Development Workflow:')
  console.log('   1. Make changes to your code')
  console.log('   2. Run: npm run build && node aws-deploy.js')
  console.log('   3. Refresh Framer to see changes')
  console.log('')
  console.log('📦 Create plugin package: npm run pack')
  console.log('')
  console.log('Press Ctrl+C to stop the server')
}) 