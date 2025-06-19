# thomas.design Blog

A sophisticated Hexo-powered portfolio and blog for Thomas Walichiewicz, featuring a custom theme with advanced performance optimizations, rich media galleries, and professional content management capabilities.

---

## 🚀 Overview

This is a **static site generator (SSG)** built on Hexo 7.3.0 with a custom "san-diego" theme. It serves as both a personal blog and professional portfolio, featuring:

- **222+ blog posts and portfolio projects**
- **Custom theme with dark/light modes**
- **Advanced media galleries with video support**
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

For detailed technical documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 📦 Project Structure

```
blog/
├── source/              # Content (Markdown posts, images, assets)
│   ├── _posts/         # Blog posts and portfolio projects (222 files)
│   ├── img/            # Site-wide images
│   └── media/          # Audio/video assets
├── themes/san-diego/    # Custom theme
│   ├── layout/         # EJS templates
│   ├── source/         # Theme assets (JS, SCSS, images)
│   └── scripts/        # Build-time processors
├── scripts/            # Hexo plugins and generators
├── tools/              # Build optimization scripts
├── docs/               # Documentation
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
# Start local development server (http://localhost:4000)
npm run server

# Build the site
npm run build

# Production build with optimizations
npm run build:prod

# Deploy to GitHub Pages
npm run deploy

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
- **See** `PERFORMANCE_OPTIMIZATION.md` **for advanced tips**

---

## 🐛 Troubleshooting

- **Out of memory:** Lower batch size in `tools/optimize-images.js`
- **Sharp errors:** Update Node.js to latest LTS
- **Build failures:** Check image permissions and formats
- **SASS warnings:** These are theme-related and harmless

---

## 🔒 Security

- External links automatically get `rel="noopener noreferrer"`
- Content Security Policy via `_headers`
- No user-generated content (static site)
- GitHub Actions with minimal permissions
- Regular dependency updates

---

## ⚠️ Known Issues

See [docs/TECH_DEBT.md](./docs/TECH_DEBT.md) for detailed technical debt tracking.

### Critical Issues:
1. **HTML Size Limit**: Large index.html files due to inline post rendering
   - **Temporary Fix**: Applied in `blog-posts.ejs`
   - **Proper Fix**: Set `per_page: 20` in `_config.yml`

2. **Sass Deprecation**: Legacy JS API will break with Dart Sass 2.0
   - **Action Required**: Update build configuration

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture overview
- [docs/](./docs/) — All documentation
  - [DEVELOPMENT.md](./docs/DEVELOPMENT.md) — Developer guide
  - [DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Deployment procedures
  - [PERFORMANCE.md](./docs/PERFORMANCE.md) — Performance optimization
  - [TECH_DEBT.md](./docs/TECH_DEBT.md) — Technical debt tracker
  - [THEME_ARCHITECTURE.md](./docs/THEME_ARCHITECTURE.md) — Theme documentation
- [CLAUDE.md](./CLAUDE.md) — AI assistant instructions

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
