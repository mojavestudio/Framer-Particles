# 🤖 GitHub Actions Auto-Deployment Setup

Complete guide to set up automatic AWS deployment for Mojave Particles on every git push.

## 🎯 Overview

This setup will automatically:
- ✅ Deploy to AWS on every push to `main` branch
- ✅ Build optimized production bundles
- ✅ Upload to S3 with proper caching
- ✅ Invalidate CloudFront cache
- ✅ Create GitHub releases
- ✅ Provide deployment summaries

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** (this one!)
3. **AWS Infrastructure** (we'll set this up)

## 🚀 Step-by-Step Setup

### Step 1: Set Up AWS Infrastructure

Choose one method:

#### Option A: Automated Setup (Recommended)
```bash
cd mojave-particles
./setup-aws.sh --deploy-infra
```

#### Option B: Manual CloudFormation
```bash
# Deploy the infrastructure
aws cloudformation deploy \
  --template-file mojave-particles/aws-infrastructure.yml \
  --stack-name mojave-particles-stack \
  --parameter-overrides \
    BucketName=mojave-particles-plugin-$(date +%s) \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Get the outputs
aws cloudformation describe-stacks \
  --stack-name mojave-particles-stack \
  --query 'Stacks[0].Outputs' \
  --output table
```

### Step 2: Collect AWS Information

After infrastructure deployment, collect these values:

```bash
# Get CloudFormation outputs
aws cloudformation describe-stacks \
  --stack-name mojave-particles-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text

aws cloudformation describe-stacks \
  --stack-name mojave-particles-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text

aws cloudformation describe-stacks \
  --stack-name mojave-particles-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`PluginURL`].OutputValue' \
  --output text
```

### Step 3: Create AWS IAM User for GitHub Actions

Create a dedicated IAM user for GitHub Actions:

```bash
# Create IAM user
aws iam create-user --user-name github-actions-deployer

# Create and attach policy
cat > github-actions-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Replace YOUR_BUCKET_NAME with your actual bucket name
sed -i "s/YOUR_BUCKET_NAME/$(aws cloudformation describe-stacks --stack-name mojave-particles-stack --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)/g" github-actions-policy.json

# Create policy
aws iam create-policy \
  --policy-name MojaveParticlesGitHubActions \
  --policy-document file://github-actions-policy.json

# Attach policy to user
aws iam attach-user-policy \
  --user-name github-actions-deployer \
  --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/MojaveParticlesGitHubActions

# Create access keys
aws iam create-access-key --user-name github-actions-deployer
```

### Step 4: Configure GitHub Repository Secrets

Go to your GitHub repository settings:

1. **Navigate to**: `Your Repository` → `Settings` → `Secrets and variables` → `Actions`
2. **Click**: `New repository secret`
3. **Add these secrets**:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXXXXXXXXX` | From IAM access key creation |
| `AWS_SECRET_ACCESS_KEY` | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | From IAM access key creation |
| `AWS_REGION` | `us-east-1` | Your chosen AWS region |
| `AWS_S3_BUCKET` | `mojave-particles-plugin-xxxxx` | From CloudFormation outputs |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `E1234567890123` | From CloudFormation outputs |
| `CUSTOM_DOMAIN` | `particles.yourdomain.com` | Optional: Your custom domain |

#### Quick Copy-Paste Commands:

```bash
# Print values for easy copying
echo "AWS_ACCESS_KEY_ID: $(aws iam list-access-keys --user-name github-actions-deployer --query 'AccessKeyMetadata[0].AccessKeyId' --output text)"
echo "AWS_SECRET_ACCESS_KEY: [Use the SecretAccessKey from create-access-key output]"
echo "AWS_REGION: us-east-1"
echo "AWS_S3_BUCKET: $(aws cloudformation describe-stacks --stack-name mojave-particles-stack --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)"
echo "AWS_CLOUDFRONT_DISTRIBUTION_ID: $(aws cloudformation describe-stacks --stack-name mojave-particles-stack --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' --output text)"
```

### Step 5: Test the Deployment

#### Manual Test
1. Go to your repository on GitHub
2. Click `Actions` tab
3. Click `Deploy to AWS` workflow
4. Click `Run workflow` → `Run workflow`
5. Watch the deployment progress

#### Automatic Test
```bash
# Make a small change and push
echo "# Test deployment $(date)" >> mojave-particles/README.md
git add mojave-particles/README.md
git commit -m "test: trigger GitHub Actions deployment"
git push origin main

# Watch the action run on GitHub
```

### Step 6: Verify Deployment

After successful deployment:

```bash
# Check the plugin URL
PLUGIN_URL=$(aws cloudformation describe-stacks \
  --stack-name mojave-particles-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`PluginURL`].OutputValue' \
  --output text)

echo "🎉 Plugin URL: $PLUGIN_URL"

# Test the URL
curl -I "$PLUGIN_URL"
```

## 🔄 How It Works

### Automatic Deployment Trigger

The workflow triggers on:
- ✅ **Push to main branch** with changes in `mojave-particles/` folder
- ✅ **Manual trigger** via GitHub Actions UI
- ✅ **Workflow dispatch** with environment selection

### Deployment Process

1. **Checkout**: Gets the latest code
2. **Setup**: Installs Node.js and dependencies
3. **Lint**: Runs code quality checks
4. **Build**: Creates optimized production bundle
5. **Deploy**: Uploads to S3 with proper headers
6. **Invalidate**: Clears CloudFront cache
7. **Release**: Creates GitHub release with deployment info

### Build Optimization

The production build includes:
- ✅ **Code minification** via esbuild
- ✅ **Tree shaking** to remove unused code
- ✅ **Chunk splitting** for better caching
- ✅ **Asset optimization** with proper naming
- ✅ **Source maps disabled** for smaller bundles

## 📊 Monitoring Deployments

### GitHub Actions Dashboard

Monitor deployments at:
`https://github.com/YOUR_USERNAME/particles/actions`

### Deployment Status

Each deployment shows:
- ✅ **Build time** and **success/failure status**
- ✅ **Plugin URLs** (S3, CloudFront, Custom Domain)
- ✅ **Release notes** with commit information
- ✅ **Deployment summaries** with instructions

### AWS Monitoring

Monitor AWS resources:
```bash
# Check S3 bucket contents
aws s3 ls s3://your-bucket-name/ --recursive

# Check CloudFront distribution status
aws cloudfront get-distribution \
  --id YOUR_DISTRIBUTION_ID \
  --query 'Distribution.Status'

# View recent invalidations
aws cloudfront list-invalidations \
  --distribution-id YOUR_DISTRIBUTION_ID
```

## 🛠️ Customization

### Environment-Specific Deployments

The workflow supports staging environments:

1. Add staging secrets with `_STAGING` suffix:
   - `AWS_S3_BUCKET_STAGING`
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID_STAGING`

2. Run manual deployment:
   ```
   Actions → Deploy to AWS → Run workflow → Select "staging"
   ```

### Custom Deployment Conditions

Modify `.github/workflows/aws-deploy.yml`:

```yaml
# Deploy only on version tags
on:
  push:
    tags: ['v*']

# Deploy on multiple branches
on:
  push:
    branches: [main, develop, staging]
```

### Notification Setup

Add Slack/Discord notifications:

```yaml
- name: Notify Deployment
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: 'Mojave Particles deployed successfully! 🎉'
```

## 🚨 Troubleshooting

### Common Issues

**❌ Permission Denied**
- Verify IAM user has correct policies
- Check AWS credentials in GitHub secrets

**❌ Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json

**❌ Deployment Timeouts**
- Large bundles may timeout; optimize build
- Check AWS service status

**❌ CloudFront Cache Issues**
- Invalidation may take 5-15 minutes
- Check invalidation status in AWS console

### Debug Commands

```bash
# Check IAM user permissions
aws iam list-attached-user-policies --user-name github-actions-deployer

# Test AWS credentials
aws sts get-caller-identity

# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name mojave-particles-stack

# Validate GitHub Actions workflow
cd .github/workflows && yamllint aws-deploy.yml
```

## 🎉 Success!

Once set up, your workflow will be:

1. **Make changes** to your plugin code
2. **Commit and push** to main branch
3. **GitHub Actions automatically**:
   - Builds your plugin
   - Deploys to AWS
   - Updates CloudFront
   - Creates releases
4. **Your plugin is live** at the CloudFront URL!

### Next Steps

- 🌐 **Set up custom domain** (optional)
- 📊 **Monitor usage** with CloudWatch
- 🔒 **Set up AWS WAF** for additional security
- 💰 **Optimize costs** with S3 Intelligent Tiering

Your Mojave Particles plugin now has enterprise-grade CI/CD! 🚀 