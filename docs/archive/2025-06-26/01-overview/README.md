# Documentation Index

Welcome to the thomas.design blog documentation. This directory contains comprehensive technical documentation for developers, maintainers, and contributors.

## 📚 Core Documentation

### Architecture & Development
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete developer guide with setup, workflow, and best practices
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures and CI/CD pipeline details
- **[THEME_ARCHITECTURE.md](./THEME_ARCHITECTURE.md)** - Deep dive into the san-diego theme structure
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization strategies and metrics
- **[TECH_DEBT.md](./TECH_DEBT.md)** - Technical debt tracking and remediation plans

### Feature Documentation
- **[Adaptive Video System](./README-adaptive-videos.md)** - Dynamic video serving based on layout
- **[Anchor Links](./ANCHOR_LINKS.md)** - Internal navigation system documentation
- **[Carousel Component](./carousel-component.md)** - Media carousel implementation details
- **[Alert Messages](./alert-message-component.md)** - Alert/notification system
- **[Project Summary](./project-summary-component.md)** - Portfolio project summaries
- **[Impact Report](./impact-report-system.md)** - Data visualization system

### Implementation Guides
- **[Video Conversion Guide](./video-conversion-guide.md)** - Converting and optimizing video assets
- **[CSS Refactoring](./css-refactoring-plan.md)** - SCSS architecture improvements
- **[JS Refactoring](./js-refactoring-plan.md)** - JavaScript modernization plans
- **[Editorial Design Library](./editorial-design-library.md)** - Design system documentation

## 🎯 Quick Start

### Adding Video Cover Images

1. **Create video versions** (minimum required):

   ```bash
   # Square version (1:1) for 1x1, 2x2 grids
   ffmpeg -i source.mov -c:v libx264 -profile:v baseline -crf 23 project-square.mp4
   ffmpeg -i source.mov -c:v libvpx-vp9 -crf 30 -b:v 0 project-square.webm
   
   # Wide version (16:9) for 3x1 grids  
   ffmpeg -i source-169.mov -c:v libx264 -profile:v baseline -crf 23 project-wide.mp4
   ffmpeg -i source-169.mov -c:v libvpx-vp9 -crf 30 -b:v 0 project-wide.webm
   ```

2. **Add to project markdown**:

   ```yaml
   ---
   title: My Project
   cover_image: /path/to/project-simple.mp4
   cover_video_poster: /path/to/project-poster.jpg
   ---
   ```

3. **The system automatically**:
   - Detects video files
   - Serves optimal versions based on grid size
   - Falls back gracefully if versions are missing

## 🏗️ Architecture

### File Structure

```
blog/
├── docs/                          # Documentation
├── source/_posts/                 # Blog posts and projects
│   └── Project-Name/             # Project media folder
│       ├── project-square.webm   # 1:1 aspect ratio
│       ├── project-square.mp4    # 1:1 fallback
│       ├── project-wide.webm     # 16:9 aspect ratio
│       ├── project-wide.mp4      # 16:9 fallback
│       └── project-compatible.*  # Universal fallbacks
├── themes/san-diego/
│   ├── layout/                   # EJS templates
│   ├── source/js/components/     # JavaScript modules
│   └── source/styles/            # SCSS stylesheets
└── public/                       # Generated site
```

### Key Components

- **AdaptiveVideoManager** - Handles dynamic video source switching
- **VideoAutoplayManager** - Manages autoplay with intersection observer
- **Portfolio Grid System** - Dynamic grid layouts with data attributes
- **Mobile Tabs** - Touch-friendly navigation

## 🔧 Development

### Running the Development Server

```bash
hexo server --port 4001
```

### Testing Video Systems

- **Main site**: `http://localhost:4001`
- **Test page**: `http://localhost:4001/test-adaptive-video.html`

## 🚀 Key Features

### Performance
- **Build-time optimization** with Sharp.js and hexo-minify
- **Lazy loading** for images and videos
- **Progressive enhancement** approach
- **Automated CI/CD** with GitHub Actions

### Content Management
- **222+ posts** with rich media support
- **Multiple post types** (blog, portfolio, link)
- **Advanced galleries** with video support
- **Dark/light theme modes**

### Developer Experience
- **Hot reload** development server
- **SCSS with design tokens**
- **ES6 modules** architecture
- **Comprehensive documentation**

## 📋 Quick Reference

### Common Tasks
```bash
# Start development
npm run server

# Create new content
hexo new blog-post "Title"
hexo new portfolio-post "Project"

# Build for production
npm run build:prod

# Deploy to GitHub Pages
npm run deploy
```

### File Locations
- **Content**: `source/_posts/`
- **Theme**: `themes/san-diego/`
- **Config**: `_config.yml`
- **Build tools**: `tools/`, `scripts/`

### Important Links
- **Production**: [thomas.design](https://thomas.design)
- **Repository**: [GitHub](https://github.com/twalichiewicz/blog)
- **Main README**: [../README.md](../README.md)
- **Architecture**: [../ARCHITECTURE.md](../ARCHITECTURE.md)

---

*Documentation last updated: June 2025*
