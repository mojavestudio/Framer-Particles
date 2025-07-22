# ☁️ AWS Deployment Guide

Complete guide for deploying Mojave Particles Plugin to AWS with S3, CloudFront, and optional custom domain.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup-aws.sh --deploy-infra

# This will:
# 1. Check prerequisites
# 2. Configure settings
# 3. Deploy infrastructure
# 4. Build and deploy the plugin
```

### Option 2: Manual Setup

```bash
# 1. Install AWS dependencies
npm install --legacy-peer-deps

# 2. Configure AWS
cp aws.env.example aws.env
# Edit aws.env with your settings

# 3. Deploy infrastructure (optional)
aws cloudformation deploy \
  --template-file aws-infrastructure.yml \
  --stack-name mojave-particles-stack \
  --capabilities CAPABILITY_IAM

# 4. Build and deploy
npm run deploy
```

## 📋 Prerequisites

### Required Tools
- **Node.js 18+** - [Download](https://nodejs.org/)
- **AWS CLI** - [Install Guide](https://aws.amazon.com/cli/)
- **AWS Account** with appropriate permissions

### AWS Permissions Required
Your AWS user/role needs these permissions:
- **S3**: Full access to your bucket
- **CloudFront**: Create invalidations
- **CloudFormation**: Deploy stacks (if using infrastructure automation)

## ⚙️ Configuration

### Environment Variables

Create `aws.env` file:
```bash
# S3 Bucket (will be created if doesn't exist)
AWS_S3_BUCKET=mojave-particles-plugin-unique-name

# AWS Region
AWS_REGION=us-east-1

# CloudFront Distribution ID (after setup)
AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234567890123

# Custom Domain (optional)
CUSTOM_DOMAIN=particles.yourdomain.com
```

### AWS Credentials

Choose one method:

**Option A: AWS CLI Profile**
```bash
aws configure
# Enter: Access Key, Secret Key, Region, Output format
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

**Option C: IAM Role** (for EC2/Lambda)
- Attach appropriate IAM role to your instance
- No manual credentials needed

## 🏗️ Infrastructure

### Architecture Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Framer    │───▶│  CloudFront  │───▶│     S3      │
│   Plugin    │    │     CDN      │    │   Bucket    │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                   ┌──────────────┐
                   │   Route53    │
                   │ (Optional)   │
                   └──────────────┘
```

### CloudFormation Stack

The `aws-infrastructure.yml` template creates:

- **S3 Bucket**: Hosts plugin files with proper CORS
- **CloudFront Distribution**: Global CDN with SSL
- **Origin Access Control**: Secure bucket access
- **Bucket Policy**: Public read access for plugin files

### Manual Infrastructure Setup

If you prefer manual setup:

#### 1. Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

#### 2. Configure CORS
```bash
aws s3api put-bucket-cors \
  --bucket your-bucket-name \
  --cors-configuration file://cors-config.json
```

#### 3. Create CloudFront Distribution
```bash
# Use AWS Console or CLI to create distribution
# Point origin to your S3 bucket
# Enable SSL redirect
```

## 🌐 Custom Domain Setup

### Step 1: SSL Certificate

Request ACM certificate (must be in us-east-1 for CloudFront):
```bash
aws acm request-certificate \
  --domain-name particles.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### Step 2: DNS Validation

1. Get validation records:
```bash
aws acm describe-certificate \
  --certificate-arn your-cert-arn \
  --region us-east-1
```

2. Add CNAME records to your DNS provider
3. Wait for validation (usually 5-10 minutes)

### Step 3: Update CloudFront

Update the CloudFormation stack with certificate:
```bash
aws cloudformation update-stack \
  --stack-name mojave-particles-stack \
  --use-previous-template \
  --parameters \
    ParameterKey=CertificateArn,ParameterValue=your-cert-arn \
    ParameterKey=DomainName,ParameterValue=particles.yourdomain.com
```

### Step 4: DNS Mapping

Add CNAME record to your domain:
```
particles.yourdomain.com → d1234567890123.cloudfront.net
```

## 🔄 Deployment

### Available Commands

```bash
# Development
npm run dev              # Local development server
npm run build            # Build for development
npm run build:prod       # Build for production

# Deployment
npm run deploy           # Build and deploy to AWS
npm run deploy:dev       # Deploy existing build

# Setup
./setup-aws.sh           # Interactive setup
./setup-aws.sh -i        # Setup with infrastructure deployment
./setup-aws.sh -d        # Setup with deployment
```

### Deployment Process

1. **Build**: Optimized production build with:
   - Code minification
   - Asset optimization
   - Chunk splitting for better caching

2. **Upload**: Deploy to S3 with:
   - Proper MIME types
   - Cache headers
   - CORS configuration

3. **Invalidate**: Clear CloudFront cache for immediate updates

### Manual Deployment

```bash
# Build
npm run build:prod

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ \
  --delete \
  --cache-control "public,max-age=31536000"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234567890123 \
  --paths "/*"
```

## 🤖 GitHub Actions

### Setup Repository Secrets

Add these secrets to your GitHub repository:

| Secret | Description | Example |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | `wJalrXUtnFEMI/K7MDENG/...` |
| `AWS_REGION` | AWS Region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 Bucket Name | `mojave-particles-plugin` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront ID | `E1234567890123` |
| `CUSTOM_DOMAIN` | Custom Domain | `particles.yourdomain.com` |

### Automatic Deployment

- **Push to main**: Automatically deploys to production
- **Manual trigger**: Use GitHub Actions UI to deploy manually

### Workflow Features

- ✅ Dependency caching
- ✅ Linting checks
- ✅ Production builds
- ✅ AWS deployment
- ✅ Cache invalidation
- ✅ Release creation
- ✅ Deployment summaries

## 🔍 Testing Deployment

### Verify Upload
```bash
# Check S3 bucket contents
aws s3 ls s3://your-bucket-name/ --recursive

# Test direct S3 access
curl -I https://your-bucket-name.s3.us-east-1.amazonaws.com/index.html
```

### Verify CloudFront
```bash
# Test CloudFront distribution
curl -I https://d1234567890123.cloudfront.net/

# Check custom domain (if configured)
curl -I https://particles.yourdomain.com/
```

### Verify in Framer

1. Open Framer
2. Go to **Plugins** → **Developer Tools**
3. Load plugin with your production URL
4. Test all plugin functionality

## 🛠️ Troubleshooting

### Common Issues

**❌ CORS Errors**
- Check S3 bucket CORS configuration
- Verify CloudFront CORS headers
- Ensure Framer domains are whitelisted

**❌ SSL Certificate Issues**
- Certificate must be in us-east-1 region
- DNS validation records must be correct
- Wait for validation completion

**❌ CloudFront Caching**
- Create invalidation after deployment
- Check cache headers
- Wait for distribution deployment

**❌ Build Failures**
- Check Node.js version (18+ required)
- Clear node_modules and reinstall
- Verify all dependencies are installed

### Debug Commands

```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 access
aws s3 ls s3://your-bucket-name/

# Check CloudFront distribution
aws cloudfront get-distribution --id E1234567890123

# Verify certificate
aws acm describe-certificate --certificate-arn your-cert-arn --region us-east-1
```

## 📊 Monitoring

### CloudWatch Metrics

Monitor these metrics:
- **S3**: Request count, error rate
- **CloudFront**: Cache hit ratio, origin response time
- **Route53**: Query count (if using custom domain)

### Cost Optimization

- **S3**: Use Intelligent Tiering for large files
- **CloudFront**: Use appropriate price class
- **Route53**: Only pay for DNS queries

## 🔒 Security Best Practices

### AWS IAM
- Use least privilege principle
- Rotate access keys regularly
- Use IAM roles when possible

### S3 Security
- Enable bucket encryption
- Block public ACLs
- Use bucket policies for controlled access

### CloudFront Security
- Enable security headers
- Use Origin Access Control
- Consider AWS WAF for additional protection

## 📈 Performance Optimization

### Build Optimization
- Code splitting for smaller chunks
- Asset minification and compression
- Tree shaking to remove unused code

### CDN Optimization
- Proper cache headers
- Gzip compression
- Regional edge caches

### Monitoring Performance
- CloudFront cache hit ratio
- Origin response times
- User experience metrics

## 💰 Cost Estimation

### Monthly Costs (estimated)

**Light Usage** (~1K requests/month):
- S3: $0.01
- CloudFront: $0.50
- Route53: $0.50
- **Total: ~$1.01/month**

**Heavy Usage** (~100K requests/month):
- S3: $0.10
- CloudFront: $8.50
- Route53: $0.50
- **Total: ~$9.10/month**

*Prices may vary by region and usage patterns* 