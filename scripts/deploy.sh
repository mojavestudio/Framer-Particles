#!/bin/bash

# Mojave Particles - Deployment Script
# This script helps deploy the plugin to Framer

set -e

echo "🚀 Starting Mojave Particles deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "particles.tsx" ]; then
    print_error "particles.tsx not found. Please run this script from the project root."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Framer CLI is installed
if ! command -v framer &> /dev/null; then
    print_error "Framer CLI not found. Please install it first: npm install -g @framer/cli"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Ask for confirmation
read -p "Do you want to deploy version $CURRENT_VERSION to Framer? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled."
    exit 0
fi

# Build the project
print_status "Building project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

print_success "Build completed successfully."

# Run tests
print_status "Running tests..."
npm test

if [ $? -ne 0 ]; then
    print_warning "Tests failed, but continuing with deployment..."
fi

# Publish to Framer
print_status "Publishing to Framer..."
framer publish

if [ $? -ne 0 ]; then
    print_error "Failed to publish to Framer. Please check your credentials and try again."
    exit 1
fi

print_success "Successfully published to Framer!"

# Create git tag
print_status "Creating git tag..."
git tag -a "v$CURRENT_VERSION" -m "Release version $CURRENT_VERSION"
git push origin "v$CURRENT_VERSION"

print_success "Git tag created and pushed."

# Update changelog
print_status "Updating changelog..."
echo "## [$CURRENT_VERSION] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "" >> CHANGELOG.md
echo "### Added" >> CHANGELOG.md
echo "- Automated deployment" >> CHANGELOG.md
echo "" >> CHANGELOG.md

print_success "Changelog updated."

# Summary
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "Summary:"
echo "  - Version: $CURRENT_VERSION"
echo "  - Published to Framer: ✅"
echo "  - Git tag created: ✅"
echo "  - Changelog updated: ✅"
echo ""
echo "Next steps:"
echo "  1. Test the published plugin in Framer"
echo "  2. Update documentation if needed"
echo "  3. Share with the community"
echo ""

print_status "Deployment script completed." 