# Publishing Guide

This guide will help you publish the Mojave Particles plugin to both GitHub and Framer.

## Prerequisites

Before publishing, make sure you have:

- [ ] GitHub account with repository access
- [ ] Framer account with plugin publishing permissions
- [ ] Node.js and npm installed
- [ ] Git configured with your credentials
- [ ] Framer CLI installed (`npm install -g @framer/cli`)

## Step 1: Prepare for Release

### 1.1 Update Version

Update the version in `package.json`:

```json
{
  "version": "1.0.0"
}
```

### 1.2 Update Changelog

Add your changes to `CHANGELOG.md`:

```markdown
## [1.0.0] - 2024-01-XX

### Added
- Initial release
- Basic particle system
- Spline compatibility mode

### Changed
- Improved performance
- Enhanced property controls

### Fixed
- Preview animation toggle
- Canvas rendering issues
```

### 1.3 Test Everything

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Test locally
npm start
```

## Step 2: Publish to GitHub

### 2.1 Create Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `mojave-particles`
4. Make it public
5. Don't initialize with README (we already have one)

### 2.2 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial release v1.0.0"

# Add remote
git remote add origin https://github.com/yourusername/mojave-particles.git

# Push to main branch
git push -u origin main
```

### 2.3 Create Release

1. Go to your repository on GitHub
2. Click "Releases" in the right sidebar
3. Click "Create a new release"
4. Tag: `v1.0.0`
5. Title: `Release v1.0.0`
6. Description: Copy from your changelog
7. Click "Publish release"

## Step 3: Publish to Framer

### 3.1 Login to Framer

```bash
framer login
```

### 3.2 Publish Plugin

```bash
# Using the deployment script
./scripts/deploy.sh

# Or manually
framer publish
```

### 3.3 Verify Publication

1. Go to [Framer Community](https://framer.com/community)
2. Search for "Mojave Particles"
3. Verify your plugin appears
4. Test the installation process

## Step 4: Publish to npm (Optional)

If you want to publish to npm as well:

### 4.1 Login to npm

```bash
npm login
```

### 4.2 Publish Package

```bash
npm publish
```

## Step 5: Post-Publication

### 5.1 Update Documentation

- Update any hardcoded URLs in README.md
- Add installation instructions
- Update examples if needed

### 5.2 Share with Community

- Post on Framer Community forums
- Share on social media
- Add to relevant collections
- Create demo projects

### 5.3 Monitor and Respond

- Watch for issues on GitHub
- Respond to user questions
- Monitor usage analytics
- Plan future updates

## Automated Deployment

For future releases, you can use the automated deployment script:

```bash
# Make sure you're on the main branch
git checkout main

# Update version in package.json
# Update changelog

# Run deployment script
./scripts/deploy.sh
```

The script will:
- ✅ Build the project
- ✅ Run tests
- ✅ Publish to Framer
- ✅ Create git tag
- ✅ Update changelog
- ✅ Provide deployment summary

## Troubleshooting

### Common Issues

**Build fails:**
- Check for TypeScript errors
- Verify all dependencies are installed
- Check console for specific error messages

**Publish fails:**
- Verify Framer CLI is installed and logged in
- Check internet connection
- Ensure you have publishing permissions

**Git issues:**
- Verify git credentials are configured
- Check repository permissions
- Ensure you're on the correct branch

### Getting Help

- Check [Framer Plugin Documentation](https://framer.com/docs/plugins)
- Review [GitHub Issues](https://github.com/yourusername/mojave-particles/issues)
- Ask in [Framer Community](https://framer.com/community)

## Version Management

### Semantic Versioning

Use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

Before each release:

- [ ] Update version in package.json
- [ ] Update changelog
- [ ] Test all features
- [ ] Build successfully
- [ ] Update documentation
- [ ] Create git tag
- [ ] Publish to Framer
- [ ] Verify installation
- [ ] Share with community

## Success Metrics

Track these metrics to measure success:

- **Downloads**: Number of plugin installations
- **Usage**: Active users and projects
- **Feedback**: GitHub stars, issues, discussions
- **Community**: Mentions and shares
- **Performance**: User satisfaction and bug reports

---

Good luck with your release! 🚀 