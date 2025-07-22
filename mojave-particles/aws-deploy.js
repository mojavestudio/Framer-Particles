#!/usr/bin/env node

/**
 * AWS Deployment Script for Mojave Particles Plugin
 * Deploys built files to S3 and invalidates CloudFront cache
 */

import { S3Client, PutObjectCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const CONFIG = {
  bucket: process.env.AWS_S3_BUCKET || 'mojave-particles-plugin',
  region: process.env.AWS_REGION || 'us-east-1',
  distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
  distDir: join(__dirname, 'dist'),
  domain: process.env.CUSTOM_DOMAIN || null // e.g. 'particles.yourdomain.com'
}

// MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
}

// Initialize AWS clients
const s3Client = new S3Client({ region: CONFIG.region })
const cloudFrontClient = new CloudFrontClient({ region: CONFIG.region })

/**
 * Get MIME type for file extension
 */
function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

/**
 * Set up S3 bucket CORS configuration for Framer compatibility
 */
async function configureBucketCors() {
  console.log('🔧 Configuring S3 bucket CORS...')
  
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedOrigins: [
          'https://framer.com',
          'https://*.framer.com',
          'https://localhost:*',
          'https://127.0.0.1:*'
        ],
        AllowedMethods: ['GET', 'HEAD'],
        AllowedHeaders: ['*'],
        MaxAgeSeconds: 3600
      }
    ]
  }

  try {
    await s3Client.send(new PutBucketCorsCommand({
      Bucket: CONFIG.bucket,
      CORSConfiguration: corsConfiguration
    }))
    console.log('✅ CORS configuration applied successfully')
  } catch (error) {
    console.warn('⚠️ CORS configuration failed (bucket may already exist):', error.message)
  }
}

/**
 * Upload a single file to S3
 */
async function uploadFile(filePath, s3Key) {
  const fileContent = readFileSync(filePath)
  const mimeType = getMimeType(filePath)
  
  const params = {
    Bucket: CONFIG.bucket,
    Key: s3Key,
    Body: fileContent,
    ContentType: mimeType,
    CacheControl: s3Key.includes('index') ? 'no-cache' : 'public, max-age=31536000'
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    console.log(`✅ Uploaded: ${s3Key}`)
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error.message)
    throw error
  }
}

/**
 * Recursively upload directory contents
 */
async function uploadDirectory(dirPath, prefix = '') {
  const items = readdirSync(dirPath)
  
  for (const item of items) {
    const itemPath = join(dirPath, item)
    const stat = statSync(itemPath)
    
    if (stat.isDirectory()) {
      await uploadDirectory(itemPath, `${prefix}${item}/`)
    } else {
      const s3Key = `${prefix}${item}`
      await uploadFile(itemPath, s3Key)
    }
  }
}

/**
 * Invalidate CloudFront cache
 */
async function invalidateCache() {
  if (!CONFIG.distributionId) {
    console.log('⚠️ No CloudFront distribution ID provided, skipping cache invalidation')
    return
  }

  console.log('🔄 Invalidating CloudFront cache...')
  
  try {
    const invalidation = await cloudFrontClient.send(new CreateInvalidationCommand({
      DistributionId: CONFIG.distributionId,
      InvalidationBatch: {
        Paths: {
          Quantity: 1,
          Items: ['/*']
        },
        CallerReference: Date.now().toString()
      }
    }))
    
    console.log(`✅ Cache invalidation created: ${invalidation.Invalidation.Id}`)
  } catch (error) {
    console.error('❌ Cache invalidation failed:', error.message)
    throw error
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log('🚀 Starting AWS deployment...')
  console.log(`📁 Bucket: ${CONFIG.bucket}`)
  console.log(`🌎 Region: ${CONFIG.region}`)
  console.log(`📂 Source: ${CONFIG.distDir}`)
  
  try {
    // Check if dist directory exists
    if (!statSync(CONFIG.distDir).isDirectory()) {
      throw new Error('dist directory not found. Run "npm run build" first.')
    }

    // Configure CORS
    await configureBucketCors()
    
    // Upload files
    console.log('📤 Uploading files to S3...')
    await uploadDirectory(CONFIG.distDir)
    
    // Invalidate cache
    await invalidateCache()
    
    // Display final URLs
    const bucketUrl = `https://${CONFIG.bucket}.s3.${CONFIG.region}.amazonaws.com`
    const cloudFrontUrl = CONFIG.distributionId ? `https://${CONFIG.distributionId}.cloudfront.net` : null
    const customUrl = CONFIG.domain ? `https://${CONFIG.domain}` : null
    
    console.log('\n🎉 Deployment completed successfully!')
    console.log('\n📋 Available URLs:')
    console.log(`   S3 Direct: ${bucketUrl}`)
    if (cloudFrontUrl) console.log(`   CloudFront: ${cloudFrontUrl}`)
    if (customUrl) console.log(`   Custom Domain: ${customUrl}`)
    
    console.log('\n💡 To use in Framer:')
    console.log(`   Load plugin with: ${customUrl || cloudFrontUrl || bucketUrl}`)
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

// Run deployment
deploy() 