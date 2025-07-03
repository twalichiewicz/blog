# Getting Started

Welcome to the Thomas.design portfolio development guide. This guide will help you set up your development environment and start contributing.

## Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Git**
- **Text editor** (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/twalichiewicz/blog.git
cd blog
```

### 2. Install Dependencies

```bash
# Install main dependencies
npm install

# Install demo dependencies
npm run install:demos
```

### 3. Verify Installation

```bash
# Run quick tests
npm run test:quick

# Start development server
npm run server
```

Visit http://localhost:4000 to see the site running locally.

## Project Structure

```
blog/
├── source/              # Content files
│   ├── _posts/         # Blog posts & portfolio projects
│   ├── img/            # Global images
│   └── media/          # Audio/video files
├── themes/san-diego/    # Custom theme
│   ├── layout/         # EJS templates
│   ├── source/         # Theme assets (JS, SCSS)
│   └── scripts/        # Build processors
├── demos/              # Interactive portfolio demos
│   ├── shared/         # Shared components
│   └── [demos]/        # Individual demo projects
├── scripts/            # Build & test scripts
├── docs/               # Documentation
└── _config.yml         # Hexo configuration
```

## Development Workflow

### 1. Daily Development

```bash
# Start dev server
npm run server

# In another terminal, run quick tests
npm run test:dev

# Watch for demo changes
npm run dev:demos
```

### 2. Making Changes

1. Create a feature branch
2. Make your changes
3. Test your changes
4. Commit with descriptive message

```bash
git checkout -b feature/my-feature
# Make changes
npm run test:quick
git add .
git commit -m "feat: add new feature"
```

### 3. Before Pushing

```bash
# Run full test suite
npm test

# Build production version
npm run build:prod

# Check for issues
npm run lint:scss
```

## Common Development Tasks

### Creating Content

```bash
# New blog post
hexo new blog-post "My Post Title"

# New portfolio project
hexo new portfolio-post "Project Name"

# New case study
hexo new case-study "Case Study Title"
```

### Working with Demos

```bash
# Create new demo
npm run create:demo

# Start demo dev server
cd demos/my-demo
npm run dev

# Build all demos
npm run build:demos
```

### Styling Changes

1. SCSS files are in `themes/san-diego/source/styles/`
2. Follow existing patterns
3. Test in both light and dark modes
4. Run linter: `npm run lint:scss`

### JavaScript Changes

1. JS files are in `themes/san-diego/source/js/`
2. Use ES6 modules
3. Test across browsers
4. Keep bundle size minimal

## Environment Configuration

### Development vs Production

Development mode:
- Unminified assets
- Source maps enabled
- Detailed error messages
- Draft posts visible

Production mode:
- Minified assets
- Optimized images
- No drafts
- Performance optimized

### Configuration Files

- `_config.yml` - Main Hexo config
- `package.json` - Dependencies & scripts
- `demos/demo-config.json` - Demo system config
- `.env.example` - Environment variables template

## Best Practices

### Code Style

1. **Consistency**: Match existing code style
2. **Comments**: Document complex logic
3. **Testing**: Test all changes
4. **Performance**: Monitor bundle sizes

### Git Workflow

1. **Branch naming**: `feature/`, `fix/`, `docs/`
2. **Commit messages**: Use conventional commits
3. **Pull requests**: Include description and testing notes
4. **Reviews**: Address feedback promptly

### Performance

1. **Images**: Optimize before committing
2. **JavaScript**: Lazy load when possible
3. **CSS**: Avoid redundant styles
4. **Demos**: Keep bundles under 1MB

## Debugging

### Common Issues

**Port already in use**
```bash
lsof -i :4000
kill -9 $(lsof -t -i:4000)
```

**Build failures**
```bash
hexo clean
rm -rf node_modules
npm install
```

**Demo not working**
```bash
cd demos/problem-demo
npm install
npm run build
```

### Debug Tools

- Browser DevTools (F12)
- React DevTools (for demos)
- `console.log()` debugging
- VS Code debugger

## Getting Help

### Documentation

- [Testing Guide](./testing.md)
- [Creating Content](./creating-content.md)
- [Creating Demos](./creating-demos.md)
- [Troubleshooting](./troubleshooting.md)

### Resources

- [Hexo Documentation](https://hexo.io/docs/)
- [Project README](../../../README.md)
- [Quick Reference](../../QUICK-REFERENCE.md)

### Contributing

1. Read contribution guidelines
2. Check existing issues
3. Discuss major changes first
4. Follow code standards

---

*Next steps: [Creating Content](./creating-content.md) | [Testing Guide](./testing.md)*