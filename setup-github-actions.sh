#!/bin/bash

# GitHub Actions Setup Script for Mojave Particles
# This script helps set up GitHub Actions deployment to AWS

set -e

echo "🤖 GitHub Actions Setup for Mojave Particles"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first.${NC}"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI not found. You'll need to add secrets manually.${NC}"
    GH_CLI_AVAILABLE=false
else
    GH_CLI_AVAILABLE=true
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Check if CloudFormation stack exists
echo -e "\n${BLUE}Checking AWS infrastructure...${NC}"

STACK_NAME="mojave-particles-stack"
if aws cloudformation describe-stacks --stack-name $STACK_NAME &> /dev/null; then
    echo -e "${GREEN}✅ CloudFormation stack found: $STACK_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  CloudFormation stack not found${NC}"
    echo "Please deploy the AWS infrastructure first:"
    echo "  cd mojave-particles && ./setup-aws.sh --deploy-infra"
    exit 1
fi

# Get CloudFormation outputs
echo -e "\n${BLUE}Collecting AWS information...${NC}"

BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

PLUGIN_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`PluginURL`].OutputValue' \
    --output text)

AWS_REGION=$(aws configure get region || echo "us-east-1")

echo -e "${GREEN}✅ AWS Information collected:${NC}"
echo "   S3 Bucket: $BUCKET_NAME"
echo "   CloudFront ID: $DISTRIBUTION_ID"
echo "   Plugin URL: $PLUGIN_URL"
echo "   Region: $AWS_REGION"

# Create IAM user for GitHub Actions
echo -e "\n${BLUE}Setting up GitHub Actions IAM user...${NC}"

IAM_USER="github-actions-deployer"

# Check if user already exists
if aws iam get-user --user-name $IAM_USER &> /dev/null; then
    echo -e "${YELLOW}⚠️  IAM user $IAM_USER already exists${NC}"
    read -p "Do you want to recreate the access keys? (y/N): " RECREATE_KEYS
    if [[ $RECREATE_KEYS =~ ^[Yy]$ ]]; then
        # Delete existing access keys
        EXISTING_KEYS=$(aws iam list-access-keys --user-name $IAM_USER --query 'AccessKeyMetadata[].AccessKeyId' --output text)
        for key in $EXISTING_KEYS; do
            aws iam delete-access-key --user-name $IAM_USER --access-key-id $key
            echo "Deleted existing access key: $key"
        done
    else
        echo "Using existing IAM user. Please ensure it has the correct permissions."
    fi
else
    # Create IAM user
    aws iam create-user --user-name $IAM_USER
    echo -e "${GREEN}✅ Created IAM user: $IAM_USER${NC}"
    
    # Create IAM policy
    cat > github-actions-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "arn:aws:s3:::$BUCKET_NAME",
        "arn:aws:s3:::$BUCKET_NAME/*"
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

    # Get AWS account ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Create policy
    aws iam create-policy \
        --policy-name MojaveParticlesGitHubActions \
        --policy-document file://github-actions-policy.json \
        --description "Policy for GitHub Actions to deploy Mojave Particles plugin"
    
    # Attach policy to user
    aws iam attach-user-policy \
        --user-name $IAM_USER \
        --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/MojaveParticlesGitHubActions
    
    echo -e "${GREEN}✅ Created and attached IAM policy${NC}"
    
    # Clean up policy file
    rm github-actions-policy.json
fi

# Create access keys
echo -e "\n${BLUE}Creating access keys...${NC}"
ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name $IAM_USER --output json)
ACCESS_KEY_ID=$(echo $ACCESS_KEY_OUTPUT | grep -o '"AccessKeyId": "[^"]*"' | cut -d'"' -f4)
SECRET_ACCESS_KEY=$(echo $ACCESS_KEY_OUTPUT | grep -o '"SecretAccessKey": "[^"]*"' | cut -d'"' -f4)

echo -e "${GREEN}✅ Access keys created${NC}"

# Custom domain prompt
echo -e "\n${BLUE}Custom domain configuration...${NC}"
read -p "Do you have a custom domain for the plugin? (y/N): " HAS_CUSTOM_DOMAIN
if [[ $HAS_CUSTOM_DOMAIN =~ ^[Yy]$ ]]; then
    read -p "Enter your custom domain (e.g., particles.yourdomain.com): " CUSTOM_DOMAIN
else
    CUSTOM_DOMAIN=""
fi

# GitHub repository information
echo -e "\n${BLUE}GitHub repository information...${NC}"
if $GH_CLI_AVAILABLE; then
    REPO_INFO=$(gh repo view --json owner,name)
    REPO_OWNER=$(echo $REPO_INFO | grep -o '"login": "[^"]*"' | cut -d'"' -f4)
    REPO_NAME=$(echo $REPO_INFO | grep -o '"name": "[^"]*"' | cut -d'"' -f4)
    echo "Repository: $REPO_OWNER/$REPO_NAME"
else
    read -p "Enter your GitHub username: " REPO_OWNER
    read -p "Enter your repository name: " REPO_NAME
fi

# Set GitHub secrets
echo -e "\n${BLUE}Setting up GitHub repository secrets...${NC}"

if $GH_CLI_AVAILABLE; then
    echo "Setting secrets using GitHub CLI..."
    
    gh secret set AWS_ACCESS_KEY_ID --body "$ACCESS_KEY_ID"
    gh secret set AWS_SECRET_ACCESS_KEY --body "$SECRET_ACCESS_KEY"
    gh secret set AWS_REGION --body "$AWS_REGION"
    gh secret set AWS_S3_BUCKET --body "$BUCKET_NAME"
    gh secret set AWS_CLOUDFRONT_DISTRIBUTION_ID --body "$DISTRIBUTION_ID"
    
    if [ -n "$CUSTOM_DOMAIN" ]; then
        gh secret set CUSTOM_DOMAIN --body "$CUSTOM_DOMAIN"
    fi
    
    echo -e "${GREEN}✅ GitHub secrets set automatically${NC}"
    
else
    echo -e "${YELLOW}Please add these secrets manually to your GitHub repository:${NC}"
    echo "Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
    echo ""
    echo "Add these secrets:"
    echo "==================="
    echo "AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
    echo "AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
    echo "AWS_REGION: $AWS_REGION"
    echo "AWS_S3_BUCKET: $BUCKET_NAME"
    echo "AWS_CLOUDFRONT_DISTRIBUTION_ID: $DISTRIBUTION_ID"
    if [ -n "$CUSTOM_DOMAIN" ]; then
        echo "CUSTOM_DOMAIN: $CUSTOM_DOMAIN"
    fi
    echo ""
fi

# Test deployment
echo -e "\n${BLUE}Testing GitHub Actions deployment...${NC}"
read -p "Do you want to trigger a test deployment now? (y/N): " TRIGGER_TEST

if [[ $TRIGGER_TEST =~ ^[Yy]$ ]]; then
    if $GH_CLI_AVAILABLE; then
        echo "Triggering GitHub Actions workflow..."
        gh workflow run "Deploy to AWS"
        echo -e "${GREEN}✅ Test deployment triggered${NC}"
        echo "Monitor progress at: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    else
        echo "To trigger a test deployment:"
        echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
        echo "2. Click 'Deploy to AWS' workflow"
        echo "3. Click 'Run workflow' → 'Run workflow'"
    fi
fi

# Summary
echo -e "\n${GREEN}🎉 GitHub Actions setup completed!${NC}"
echo "===================================="
echo ""
echo -e "${BLUE}What happens now:${NC}"
echo "1. Every push to 'main' branch will automatically deploy to AWS"
echo "2. Manual deployments available via GitHub Actions UI"
echo "3. Deployments create GitHub releases with plugin URLs"
echo ""
echo -e "${BLUE}Plugin URLs:${NC}"
echo "- CloudFront: $PLUGIN_URL"
if [ -n "$CUSTOM_DOMAIN" ]; then
    echo "- Custom Domain: https://$CUSTOM_DOMAIN"
fi
echo ""
echo -e "${BLUE}Monitor deployments:${NC}"
echo "- GitHub Actions: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo "- AWS Console: https://console.aws.amazon.com/cloudformation/"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Make a change to your plugin code"
echo "2. Commit and push to main branch"
echo "3. Watch GitHub Actions deploy automatically!"
echo ""
echo -e "${YELLOW}💡 Tip: Use the plugin URL in Framer to load your deployed plugin${NC}" 