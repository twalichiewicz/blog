# thomas.design Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/whimsical-cheesecake-adfa17/deploys)

A sophisticated Hexo-powered portfolio and blog for Thomas Walichiewicz, featuring a custom theme with advanced performance optimizations, rich media galleries, and professional content management capabilities.

---

## 🚀 Overview

This is a **static site generator (SSG)** built on Hexo 8.0.0 with a custom "san-diego" theme. It serves as both a personal blog and professional portfolio, featuring:

- **222+ blog posts and portfolio projects**
- **Custom theme with dark/light modes**
- **Advanced media galleries with video support**
- **Self-healing development system**
- **Automated performance optimizations**
- **CI/CD pipeline with GitHub Actions**
- **Responsive, accessible, and SEO-optimized**

---

## 🏗️ Architecture

- **Core Framework**: Hexo 8.0.0 (Static Site Generator)
- **Theme**: Custom "san-diego" theme with modular EJS templates
- **Styling**: SCSS with atomic design principles
- **JavaScript**: ES6 modules with component-based architecture
- **Build Tools**: Sharp.js for images, custom minification scripts
- **Deployment**: GitHub Actions → GitHub Pages

---

## 📦 Project Structure

```
blog/
├── source/              # Content (Markdown posts, images, assets)
│   ├── _posts/         # Blog posts and portfolio projects
│   ├── img/            # Site-wide images
│   └── media/          # Audio/video assets
├── themes/san-diego/    # Custom theme
│   ├── layout/         # EJS templates
│   ├── source/         # Theme assets (JS, SCSS, images)
│   └── scripts/        # Build-time processors
├── demos/              # Interactive portfolio demos
├── build-system/       # Self-healing development system
├── docs/               # Documentation guides
├── test-scripts/       # Testing and validation
├── tools/              # Build optimization and utilities
├── _config.yml         # Hexo configuration
└── package.json        # Dependencies
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+ (LTS recommended)
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

# Build everything (demos + site)
npm run build

# Production build with optimizations
npm run build:prod

# Deploy to GitHub Pages
npm run deploy

# Run tests
npm test
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

---

## ⚡ Performance Optimization Systems

### Image Optimization

- **Script:** `tools/optimize-images.js` (Node.js + Sharp)
- **What it does:**
  - Compresses JPEG/PNG images in `source/`
  - Skips already optimized or small images
  - Batch processing for efficiency
- **How to use:**
  - Run manually: `npm run optimize:images`
  - Runs automatically in CI/CD before build

### Asset Minification

- **Script:** `scripts/minify-assets.js`
- **Minifies:** HTML, CSS, JS, and images
- **Configuration:** Controlled via build scripts
- Replaces deprecated `hexo-minify` plugin

### Lazy Loading

- **Native Support:** The custom theme uses native `loading="lazy"` attributes.
- **Configuration:** `hexo-lazyload-image` is installed but currently disabled in `_config.yml` in favor of theme-based handling.

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

## 🏥 Self-Healing Development System

The portfolio includes an innovative self-healing system that automatically detects and fixes common development issues.

See [build-system/README.md](./build-system/README.md) for full details.

### Usage
```bash
npm run doctor    # Check system health
npm run fix       # Apply automatic fixes
npm run health    # Open dashboard
```

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

## 📚 Documentation

- [docs/](./docs/README.md) — Main documentation hub
  - [Desktop Install Enhancement](./docs/guides/desktop-install-enhancement.md)
  - [Foreground Editing Guide](./docs/guides/foreground-editing-guide.md)
- [build-system/](./build-system/README.md) — Build system & self-healing documentation
- [demos/](./demos/README.md) — Interactive demos documentation
- [CLAUDE.md](./CLAUDE.md) — AI assistant instructions
- [CHANGELOG.md](./CHANGELOG.md) — Project history and changes

### External Resources:
- [Hexo Documentation](https://hexo.io/docs/)
- [Sharp.js](https://sharp.pixelplumbing.com/)

---

## 👤 Author

**Thomas Walichiewicz**
- Website: [thomas.design](https://thomas.design)
- GitHub: [@twalichiewicz](https://github.com/twalichiewicz)

---

## 📄 License

This project is MIT licensed.