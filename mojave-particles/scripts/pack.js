#!/usr/bin/env node

/**
 * Framer Plugin Packing Script
 * Creates a plugin.zip file for Framer Marketplace submission
 */

import { createWriteStream } from 'fs'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import archiver from 'archiver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('📦 Creating Framer Plugin Package...')

// Files to include in the plugin package
const includeFiles = [
  'framer.json',
  'dist/',
  'public/'
]

// Files to exclude
const excludeFiles = [
  'node_modules/',
  '.git/',
  'src/',
  'scripts/',
  'aws-deploy.js',
  'aws-infrastructure.yml',
  'aws.env',
  'aws.env.example',
  'setup-aws.sh',
  'AWS_DEPLOYMENT.md',
  'CLEANUP_SUMMARY.md',
  'DEPLOYMENT.md',
  'FRAMER_PLUGIN_REQUIREMENTS.md',
  'SERVER_SCRIPTS.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'vite.config.prod.ts',
  'eslint.config.js',
  '.gitignore',
  'README.md'
]

// Create the zip file
const output = createWriteStream(join(projectRoot, 'plugin.zip'))
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
})

output.on('close', () => {
  const size = (archive.pointer() / 1024 / 1024).toFixed(2)
  console.log(`✅ Plugin package created: plugin.zip (${size} MB)`)
  console.log('📋 Files included:')
  includeFiles.forEach(file => console.log(`   - ${file}`))
  console.log('\n🚀 Ready for Framer Marketplace submission!')
  console.log('   Upload plugin.zip to: https://framer.com/plugins')
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

// Add files to the archive
function addDirectory(dirPath, archivePath = '') {
  const items = readdirSync(dirPath)
  
  for (const item of items) {
    const fullPath = join(dirPath, item)
    const relativePath = archivePath ? join(archivePath, item) : item
    
    // Skip excluded files
    if (excludeFiles.some(exclude => relativePath.startsWith(exclude))) {
      continue
    }
    
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      addDirectory(fullPath, relativePath)
    } else {
      console.log(`   Adding: ${relativePath}`)
      archive.file(fullPath, { name: relativePath })
    }
  }
}

// Add specific files and directories
for (const file of includeFiles) {
  const fullPath = join(projectRoot, file)
  
  if (statSync(fullPath).isDirectory()) {
    addDirectory(fullPath, file)
  } else {
    console.log(`   Adding: ${file}`)
    archive.file(fullPath, { name: file })
  }
}

archive.finalize() 