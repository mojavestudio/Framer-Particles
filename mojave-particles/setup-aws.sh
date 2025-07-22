#!/bin/bash

# AWS Setup Script for Mojave Particles Plugin
# This script helps set up AWS infrastructure and deployment

set -e

echo "🚀 Mojave Particles AWS Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first:${NC}"
    echo "   https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Function to prompt for input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " result
        echo "${result:-$default}"
    else
        read -p "$prompt: " result
        echo "$result"
    fi
}

# Configuration
echo -e "\n${BLUE}Configuration${NC}"
echo "=============="

BUCKET_NAME=$(prompt_with_default "S3 Bucket Name" "mojave-particles-plugin-$(date +%s)")
AWS_REGION=$(prompt_with_default "AWS Region" "us-east-1")
DOMAIN_NAME=$(prompt_with_default "Custom Domain (optional)" "")
CERTIFICATE_ARN=$(prompt_with_default "ACM Certificate ARN (optional)" "")

# Create aws.env file
echo -e "\n${BLUE}Creating configuration file...${NC}"
cat > aws.env << EOF
# AWS Configuration for Mojave Particles Plugin
AWS_S3_BUCKET=$BUCKET_NAME
AWS_REGION=$AWS_REGION
AWS_CLOUDFRONT_DISTRIBUTION_ID=
CUSTOM_DOMAIN=$DOMAIN_NAME
EOF

echo -e "${GREEN}✅ Created aws.env configuration file${NC}"

# Check AWS credentials
echo -e "\n${BLUE}Checking AWS credentials...${NC}"
if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅ AWS credentials configured for account: $ACCOUNT_ID${NC}"
else
    echo -e "${YELLOW}⚠️  AWS credentials not configured${NC}"
    echo "Please run: aws configure"
    echo "Or set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
npm install --legacy-peer-deps

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Deploy infrastructure option
echo -e "\n${BLUE}Infrastructure Deployment${NC}"
echo "========================="

if [ "$1" = "--deploy-infra" ] || [ "$1" = "-i" ]; then
    echo "Deploying CloudFormation stack..."
    
    PARAMS="ParameterKey=BucketName,ParameterValue=$BUCKET_NAME"
    
    if [ -n "$DOMAIN_NAME" ]; then
        PARAMS="$PARAMS ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME"
    fi
    
    if [ -n "$CERTIFICATE_ARN" ]; then
        PARAMS="$PARAMS ParameterKey=CertificateArn,ParameterValue=$CERTIFICATE_ARN"
    fi
    
    aws cloudformation deploy \
        --template-file aws-infrastructure.yml \
        --stack-name mojave-particles-stack \
        --parameter-overrides $PARAMS \
        --capabilities CAPABILITY_IAM \
        --region $AWS_REGION
    
    # Get outputs
    echo -e "\n${BLUE}Getting stack outputs...${NC}"
    OUTPUTS=$(aws cloudformation describe-stacks \
        --stack-name mojave-particles-stack \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs' \
        --output table)
    
    echo "$OUTPUTS"
    
    # Update aws.env with CloudFront distribution ID
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name mojave-particles-stack \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    if [ -n "$DISTRIBUTION_ID" ]; then
        sed -i.bak "s/AWS_CLOUDFRONT_DISTRIBUTION_ID=/AWS_CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID/" aws.env
        rm aws.env.bak
        echo -e "${GREEN}✅ Updated aws.env with CloudFront Distribution ID${NC}"
    fi
    
else
    echo -e "${YELLOW}Skipping infrastructure deployment${NC}"
    echo "To deploy infrastructure, run: ./setup-aws.sh --deploy-infra"
    echo "Or manually deploy the CloudFormation template: aws-infrastructure.yml"
fi

# Build and deploy
echo -e "\n${BLUE}Build and Deployment${NC}"
echo "===================="

if [ "$1" = "--deploy" ] || [ "$1" = "-d" ] || [ "$1" = "--deploy-infra" ]; then
    echo "Building for production..."
    npm run build:prod
    
    echo "Deploying to AWS..."
    source aws.env
    node aws-deploy.js
    
    echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
else
    echo -e "${YELLOW}Skipping deployment${NC}"
    echo "To deploy, run: npm run deploy"
fi

# Final instructions
echo -e "\n${GREEN}🎉 Setup completed!${NC}"
echo "=================="
echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure your aws.env file if needed"
echo "2. Run 'npm run deploy' to build and deploy"
echo "3. Use the plugin URL in Framer"
echo
echo -e "${BLUE}Files created:${NC}"
echo "- aws.env (configuration)"
echo "- aws-infrastructure.yml (CloudFormation template)"
echo "- aws-deploy.js (deployment script)"
echo
echo -e "${BLUE}Available commands:${NC}"
echo "- npm run dev          # Start development server"
echo "- npm run build:prod   # Build for production"
echo "- npm run deploy       # Build and deploy to AWS"
echo "- npm run deploy:dev   # Deploy existing build" 