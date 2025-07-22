# 🤝 Contributing to Mojave Particles

Thank you for your interest in contributing to Mojave Particles! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- Git
- Framer account (for testing)

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/mojave-particles.git`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Structure
```
src/
├── App.tsx          # Main plugin interface
├── App.css          # Styles
└── main.tsx         # Entry point
```

### Testing
- Test all changes in Framer
- Verify dark/light mode compatibility
- Test on different screen sizes
- Ensure performance with various particle counts

## 🎯 Areas for Contribution

### High Priority
- **Performance optimizations** - Improve rendering speed
- **Accessibility** - Better keyboard navigation and screen reader support
- **Mobile optimization** - Touch interactions and responsive design
- **Documentation** - Improve guides and examples

### Medium Priority
- **New presets** - Create additional professional presets
- **Advanced effects** - New particle behaviors and interactions
- **Export options** - Additional output formats
- **Integration** - Better Framer integration features

### Low Priority
- **UI improvements** - Interface enhancements
- **Code cleanup** - Refactoring and optimization
- **Testing** - Unit tests and integration tests

## 🔧 Development Workflow

### Making Changes
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly in Framer
4. Run linting: `npm run lint`
5. Run type checking: `npm run type-check`
6. Commit with descriptive message

### Commit Messages
Use conventional commit format:
```
feat: add new particle effect
fix: resolve hover interaction bug
docs: update installation guide
style: improve button styling
refactor: optimize particle rendering
test: add unit tests for physics
```

### Pull Request Process
1. Push your branch: `git push origin feature/your-feature`
2. Create a pull request
3. Provide clear description of changes
4. Include screenshots/videos if UI changes
5. Reference any related issues

## 🐛 Bug Reports

### Before Reporting
- Check existing issues for duplicates
- Test with latest version
- Try to reproduce the issue

### Bug Report Template
```
**Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Framer version:
- Browser:
- OS:
- Plugin version:

**Screenshots**
If applicable
```

## 💡 Feature Requests

### Before Requesting
- Check if feature already exists
- Consider if it fits the project scope
- Think about implementation complexity

### Feature Request Template
```
**Description**
Clear description of the feature

**Use Case**
Why this feature would be useful

**Proposed Implementation**
How you think it could work

**Alternatives**
Other ways to achieve the goal
```

## 📋 Code Review Process

### Review Checklist
- [ ] Code follows project style
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Performance impact considered

### Review Guidelines
- Be constructive and respectful
- Focus on code quality and functionality
- Suggest improvements when possible
- Approve when satisfied

## 🚀 Release Process

### Version Bumping
- **Patch** (1.2.1): Bug fixes
- **Minor** (1.3.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Release Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Test in Framer
- [ ] Create release notes
- [ ] Tag release

## 📞 Communication

### Channels
- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Email**: info@mojavestud.io for private matters

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Mojave Particles! 🌟 