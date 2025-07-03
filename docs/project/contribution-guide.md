# Contribution Guide

Thank you for your interest in contributing to the Thomas.design portfolio! This guide will help you get started.

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what's best for the project
- Show empathy towards other contributors

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing private information

## Getting Started

### Prerequisites
1. Fork the repository
2. Clone your fork locally
3. Set up development environment ([Getting Started Guide](../guides/development/getting-started.md))
4. Create a feature branch

### Development Workflow
```bash
# Create branch
git checkout -b feature/your-feature-name

# Make changes
npm run test:dev  # Test as you go

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

## Types of Contributions

### 🐛 Bug Reports
Found a bug? Please help by:
1. Checking existing issues first
2. Creating detailed bug report
3. Including reproduction steps
4. Providing system information

**Bug Report Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 91]
- Node: [e.g., 16.0.0]
```

### ✨ Feature Requests
Have an idea? We'd love to hear it:
1. Check roadmap and existing issues
2. Describe the problem it solves
3. Suggest implementation approach
4. Consider maintenance impact

### 📝 Documentation
Help improve our docs:
- Fix typos and grammar
- Clarify confusing sections
- Add missing information
- Create examples and tutorials

### 💻 Code Contributions
Contributing code? Please:
1. Follow existing patterns
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## Coding Standards

### JavaScript
```javascript
// Use ES6+ features
const componentName = 'MyComponent';

// Async/await over promises
async function fetchData() {
  try {
    const data = await api.get();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Descriptive names
function calculateViewportHeight() {
  // Clear implementation
}
```

### SCSS
```scss
// BEM naming
.component {
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}

// Use variables
color: var(--primary-color);

// Mobile-first
@media (min-width: $tablet) {
  // Desktop overrides
}
```

### React (Demos)
```jsx
// Functional components
function DemoComponent({ title, onAction }) {
  const [state, setState] = useState(initial);
  
  // Clear component logic
  return (
    <div className="demo-component">
      <h2>{title}</h2>
    </div>
  );
}

// PropTypes or TypeScript
DemoComponent.propTypes = {
  title: PropTypes.string.required,
  onAction: PropTypes.func
};
```

## Testing Requirements

### Before Submitting
Run all test suites:
```bash
# Quick tests (required)
npm run test:quick

# Full suite (recommended)
npm test

# Specific demo test
cd demos/your-demo && npm test
```

### Test Categories
1. **Unit Tests**: Component logic
2. **Integration Tests**: Component interactions
3. **Visual Tests**: UI appearance
4. **Performance Tests**: Load times and metrics

## Pull Request Process

### 1. Prepare Your PR
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commits are clean
- [ ] Branch is up to date

### 2. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Performance improvement

## Testing
- [ ] Tests pass
- [ ] Visual testing done
- [ ] Cross-browser tested

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### 3. Review Process
1. Automated checks run
2. Code review by maintainer
3. Address feedback
4. Approval and merge

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Test additions
- `chore`: Maintenance

### Examples
```bash
feat(demos): add interactive onboarding component

fix(carousel): resolve swipe gesture on mobile

docs(readme): update installation instructions

perf(images): optimize hero image loading
```

## Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

### Release Steps
1. Update changelog
2. Bump version number
3. Create release tag
4. Deploy to production

## Getting Help

### Resources
- [Documentation](../README.md)
- [Discord Community](#) (coming soon)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/hexo)

### Contact
- Open an issue for bugs
- Start a discussion for features
- Email for security issues

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Annual contributor spotlight

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Thomas.design! 🎉