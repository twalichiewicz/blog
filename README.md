# thomas.design Blog

A fast, modern, and highly optimized Hexo-powered blog for Thomas Walichiewicz. This repository includes advanced performance optimizations, automated image compression, asset minification, lazy loading, SEO enhancements, and a robust CI/CD pipeline.

---

## 🚀 Features & Optimizations

- **Automated Image Optimization** (Sharp.js)
- **HTML, CSS, JS Minification** (`hexo-minify`)
- **Image Lazy Loading** (SVG placeholders)
- **SEO Enhancements** (sitemap, search index)
- **Automated Build & Deployment** (GitHub Actions)
- **Modern Hexo Plugins** (no deprecated dependencies)
- **Comprehensive Performance Monitoring**

---

## 📦 Project Structure

- `source/` — Blog content, posts, and assets
- `themes/` — Custom theme (san-diego)
- `tools/optimize-images.js` — Image optimization script
- `.github/workflows/optimize-and-deploy.yml` — CI/CD pipeline
- `_config.yml` — Main Hexo and plugin configuration
- `PERFORMANCE_OPTIMIZATION.md` — In-depth optimization guide

---

## 🛠️ Usage & Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Development

```bash
npm run server
```

### 3. Clean Build

```bash
npm run clean && npm run build
```

### 4. Production Build (with all optimizations)

```bash
npm run build:prod
```

### 5. Image Optimization Only

```bash
npm run optimize:images
```

### 6. Analyze Build Size

```bash
npm run analyze
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

## 📚 More Documentation

- [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) — Full technical guide
- [Hexo Docs](https://hexo.io/docs/)
- [hexo-minify](https://github.com/Lete114/hexo-minify)
- [sharp](https://sharp.pixelplumbing.com/)

---

## 🏆 Credits

- **Thomas Walichiewicz** — Design, content, and development
- **Hexo** — Static site generator
- **Open Source Plugins** — See `package.json`

---

## License

MIT
