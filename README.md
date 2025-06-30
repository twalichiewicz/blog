# thomas.design Blog

A sophisticated Hexo-powered portfolio and blog for Thomas Walichiewicz, featuring a custom theme with advanced performance optimizations, rich media galleries, and professional content management capabilities.

---

## 🚀 Overview

This is a **static site generator (SSG)** built on Hexo 7.3.0 with a custom "san-diego" theme. It serves as both a personal blog and professional portfolio, featuring:

- **222+ blog posts and portfolio projects**
- **Custom theme with dark/light modes**
- **Advanced media galleries with video support**
- **Self-healing development system**
- **Automated performance optimizations**
- **CI/CD pipeline with GitHub Actions**
- **Responsive, accessible, and SEO-optimized**

---

## 🏗️ Architecture

- **Core Framework**: Hexo 7.3.0 (Static Site Generator)
- **Theme**: Custom "san-diego" theme with modular EJS templates
- **Styling**: SCSS with atomic design principles
- **JavaScript**: ES6 modules with component-based architecture
- **Build Tools**: Sharp.js for images, hexo-minify for assets
- **Deployment**: GitHub Actions → GitHub Pages

For detailed technical documentation, see [Architecture Guide](./docs/reference/architecture/overview.md).

---

## 📦 Project Structure

```
blog/
├── source/              # Content (Markdown posts, images, assets)
│   ├── _posts/         # Blog posts and portfolio projects (222+ files)
│   ├── img/            # Site-wide images
│   └── media/          # Audio/video assets
├── themes/san-diego/    # Custom theme
│   ├── layout/         # EJS templates
│   ├── source/         # Theme assets (JS, SCSS, images)
│   └── scripts/        # Build-time processors
├── demos/              # Interactive portfolio demos
│   ├── shared/         # Shared demo components
│   └── [project-demos]/# Individual demo projects
├── build-system/       # Self-healing development system
├── docs/               # Comprehensive documentation
│   ├── guides/         # How-to guides
│   ├── reference/      # Technical reference
│   └── project/        # Project management
├── test-scripts/       # Testing and validation
├── tools/              # Build optimization and utilities
├── _config.yml         # Hexo configuration
└── package.json        # Dependencies

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/twalichiewicz/blog.git
cd blog

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server with self-healing (RECOMMENDED)
npm run dev

# Check system health
npm run doctor

# Auto-fix detected issues
npm run fix

# Interactive health dashboard
npm run health

# Simple server without self-healing (legacy)
npm run server

# Build everything (demos + site)
npm run build

# Production build with optimizations
npm run build:prod

# Deploy to GitHub Pages
npm run deploy

# Run tests (comprehensive suite)
npm test

# Quick tests for development
npm run test:quick

# Optimize images only
npm run optimize:images

# Analyze build size
npm run analyze

# Lint SCSS files
npm run lint:scss
npm run lint:scss:fix
```

### Creating Content

```bash
# Create a new blog post
hexo new blog-post "My New Post"

# Create a portfolio project
hexo new portfolio-post "Project Name"

# Create a draft
hexo new draft "Work in Progress"
```

### 🤖 Claude Auto-Fix System (NEW)

Automatically fix failing tests using Claude AI:

```bash
# Set up Claude API key
export CLAUDE_API_KEY="sk-ant-..."

# Auto-fix all tests
npm run test:autofix

# Fix demo standards only
npm run fix:demos

# Preview fixes without applying
DRY_RUN=true npm run fix:demos
```

See [Claude Auto-Fix Documentation](./docs/CLAUDE-AUTOFIX-SYSTEM.md) for complete guide.

---

## ⚡ Performance Optimization Systems

### Image Optimization

- **Script:** `tools/optimize-images.js` (Node.js + Sharp)
- **What it does:**
  - Compresses JPEG/PNG images in `source/` (quality 85%, progressive, >500KB or >1920x1080px)
  - Skips already optimized or small images
  - Batch processing for efficiency
- **How to use:**
  - Run manually: `npm run optimize:images`
  - Runs automatically in CI/CD before build

### Asset Minification (`hexo-minify`)

- **Minifies:** HTML, CSS, JS, and images
- **Configuration:** See `_config.yml` under `minify:`
- **No deprecated dependencies** (replaces `hexo-filter-optimize`)
- **Preview mode**: Disabled for local server, enabled for production

### Lazy Loading

- **Plugin:** `hexo-lazyload-image`
- **SVG placeholder** for smooth UX
- **Configuration:** See `_config.yml` under `lazyload:`

### SEO & Search

- **Sitemap:** `hexo-generator-sitemap`
- **Search index:** `hexo-generator-search`
- **Feed:** `hexo-generator-feed`

### Automated CI/CD

- **Workflow:** `.github/workflows/optimize-and-deploy.yml`
- **Steps:**
  1. Install dependencies
  2. Optimize images
  3. Build with minification
  4. Analyze build size
  5. Deploy to GitHub Pages

---

## 🔧 Configuration Highlights

See `_config.yml` for all options. Key sections:

```yaml
minify:
  preview: false
  exclude: ['*.min.*']
  js:
    enable: true
    sourceMap:
      enable: false
      sourceMappingURL: false
    options: {}
  css:
    enable: true
    options: {}
  html:
    enable: true
    options:
      minifyJS: true
      minifyCSS: true
      removeComments: true
      collapseWhitespace: true
      removeAttributeQuotes: true
  image:
    enable: true
    options: {}

lazyload:
  enable: true
  placeholder: data:image/svg+xml;base64,...

sitemap:
  path: sitemap.xml
  tags: true
  categories: true

search:
  path: search.xml
  field: post
  content: true
```

---

## 🧑‍💻 Maintenance & Best Practices

- **Optimize images** before/after adding new posts
- **Check build size** regularly (`npm run analyze`)
- **Keep dependencies up to date**
- **Review largest files** and optimize further if needed
- **See** [Performance Guide](./docs/02-development/performance-guide.md) **for advanced tips**

---

## 🏥 Self-Healing Development System

The portfolio includes an innovative self-healing system that automatically detects and fixes common development issues:

### Features
- **Automatic Issue Detection**: Monitors for Hexo warehouse errors, port conflicts, memory issues, missing dependencies, and more
- **Smart Auto-Fix**: Safely repairs database corruption, kills zombie processes, rebuilds missing assets
- **Real-Time Monitoring**: Watches development server for errors and applies fixes automatically
- **Health Dashboard**: Interactive terminal UI for system monitoring and control

### Common Issues Fixed Automatically
1. **Hexo Warehouse Errors**: "ID has been used" → Cleans database and restarts
2. **Port 4000 Blocked**: Process using port → Kills process and frees port
3. **High Memory Usage**: > 800MB → Triggers garbage collection
4. **Missing Demo Builds**: Demos not in theme → Rebuilds demos
5. **Stale Cache**: > 7 days old → Clears and rebuilds cache
6. **CSS Issues**: Dark mode visibility → Updates styles

### Usage
```bash
npm run doctor    # Check system health
npm run fix       # Apply automatic fixes
npm run health    # Open dashboard (requires: npm install blessed blessed-contrib)
```

For detailed information, see [Self-Healing System Guide](./docs/guides/development/self-healing-system.md).

---

## 🐛 Troubleshooting

- **Out of memory:** Lower batch size in `tools/optimize-images.js` or use `npm run fix`
- **Sharp errors:** Update Node.js to latest LTS
- **Build failures:** Run `npm run doctor` first, then check permissions
- **SASS warnings:** These are theme-related and harmless
- **Hexo errors:** The self-healing system handles most automatically

---

## 🔒 Security

- External links automatically get `rel="noopener noreferrer"`
- Content Security Policy via `_headers`
- No user-generated content (static site)
- GitHub Actions with minimal permissions
- Regular dependency updates

---

## ⚠️ Known Issues

See [Technical Debt Analysis](./docs/04-project-health/technical-debt-analysis.md) for detailed technical debt tracking.

### Critical Issues:
1. **HTML Size Limit**: Large index.html files due to inline post rendering
   - **Temporary Fix**: Applied in `blog-posts.ejs`
   - **Proper Fix**: Set `per_page: 20` in `_config.yml`

2. **Sass Deprecation**: Legacy JS API will break with Dart Sass 2.0
   - **Action Required**: Update build configuration

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture overview
- [docs/](./docs/) — Comprehensive documentation
  - [Overview](./docs/01-overview/) — Project overview and architecture
  - [Development](./docs/02-development/) — Development guides and workflows
  - [Features](./docs/03-features/) — Component and feature documentation
  - [Project Health](./docs/04-project-health/) — Technical debt and maintenance
  - [Portfolio](./docs/portfolio/) — Portfolio analysis and improvements
  - **[Testing Guide](./docs/TESTING.md)** — Comprehensive testing system
  - **[Quick Reference](./docs/QUICK-REFERENCE.md)** — Essential commands and patterns
  - **[Demo Standardization](./docs/DEMO-STANDARDIZATION-SUMMARY.md)** — Recent improvements
- [CLAUDE.md](./CLAUDE.md) — AI assistant instructions
- [CHANGELOG.md](./CHANGELOG.md) — Project history and changes

### External Resources:
- [Hexo Documentation](https://hexo.io/docs/)
- [hexo-minify](https://github.com/Lete114/hexo-minify)
- [Sharp.js](https://sharp.pixelplumbing.com/)

---

## 👤 Author

**Thomas Walichiewicz**
- Website: [thomas.design](https://thomas.design)
- GitHub: [@twalichiewicz](https://github.com/twalichiewicz)

---

## 📄 License

This project is MIT licensed. See [LICENSE](./LICENSE) for details.
