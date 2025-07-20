# Contributing to Mojave Particles

Thank you for your interest in contributing to Mojave Particles! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
- [Additional Notes](#additional-notes)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include a clear and descriptive title
- Provide detailed steps to reproduce the bug
- Include screenshots or GIFs if applicable
- Specify your environment (OS, browser, Framer version)

### Suggesting Enhancements

- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and why it would be useful
- Include mockups or examples if possible
- Consider the impact on existing functionality

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Update documentation
- Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Framer (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mojave-particles.git

# Navigate to the project directory
cd mojave-particles

# Install dependencies
npm install

# Start development server
npm start
```

### Project Structure

```
mojave-particles/
├── particles.tsx          # Main component
├── package.json           # Dependencies and metadata
├── README.md             # Documentation
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # This file
├── LICENSE               # MIT License
├── .gitignore           # Git ignore rules
├── test-particles.html   # Test page
└── docs/                 # Additional documentation
```

## Pull Request Process

1. **Fork and Clone**: Fork the repository and clone your fork
2. **Create Branch**: Create a feature branch from `main`
3. **Make Changes**: Implement your changes
4. **Test**: Test your changes thoroughly
5. **Document**: Update documentation if needed
6. **Commit**: Write clear commit messages
7. **Push**: Push to your fork
8. **Submit PR**: Create a pull request

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(particles): add new particle shapes

fix(canvas): resolve rendering issue in Spline mode

docs(readme): update installation instructions
```

## Style Guides

### TypeScript/React

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Prefer const over let when possible
- Use meaningful variable and function names

### Code Formatting

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in objects and arrays
- Keep lines under 80 characters when possible

### Component Structure

```tsx
// Import statements
import React from 'react'
import { addPropertyControls, ControlType } from 'framer'

// Component definition
export default function ComponentName(props) {
  // Hooks and state
  const [state, setState] = useState(initialValue)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Event handlers
  const handleEvent = useCallback(() => {
    // Handler logic
  }, [dependencies])
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// Default props
ComponentName.defaultProps = {
  // Default values
}

// Property controls
addPropertyControls(ComponentName, {
  // Control definitions
})
```

### Documentation

- Write clear, concise comments
- Document complex logic
- Update README.md for new features
- Include usage examples
- Update CHANGELOG.md for releases

## Testing

### Manual Testing

1. **Framer Integration**: Test in Framer canvas and preview
2. **Spline Mode**: Test canvas rendering mode
3. **Property Controls**: Verify all controls work correctly
4. **Performance**: Test with different particle counts
5. **Responsive**: Test at different screen sizes

### Test Scenarios

- [ ] Basic particle rendering
- [ ] Property control updates
- [ ] Animation modes (static/dynamic)
- [ ] Interactive effects (click/hover)
- [ ] Spline compatibility
- [ ] Performance with high particle counts
- [ ] Error handling and fallbacks

## Additional Notes

### Performance Considerations

- Keep particle counts reasonable (under 300 for most use cases)
- Use static mode for complex scenes
- Optimize canvas rendering for Spline mode
- Consider FPS settings for different devices

### Browser Compatibility

- Test in Chrome, Firefox, Safari, and Edge
- Consider mobile browsers for responsive design
- Test with different screen resolutions

### Framer Integration

- Follow Framer's plugin guidelines
- Use proper property controls
- Handle different render targets (canvas, preview, published)
- Consider Framer's performance requirements

## Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Review the documentation
- Test with the provided test page

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to Mojave Particles! 🎉 