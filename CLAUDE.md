# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hexo-powered static blog and portfolio site for Thomas Walichiewicz. Hexo converts Markdown posts into a static website with a custom theme called "san-diego".

## Common Development Commands

```bash
# Development
npm run server          # Start local server on port 4000
npm run build          # Clean and generate static site
npm run build:prod     # Production build with optimizations

# Deployment
npm run deploy         # Deploy to GitHub Pages

# Code Quality
npm run lint:scss      # Lint SCSS files
npm run lint:scss:fix  # Auto-fix SCSS issues

# Optimization
npm run optimize:images # Optimize images in source/_posts/
npm run analyze        # Analyze build size
```

## Architecture & Key Concepts

### Content Management
- **Posts**: Markdown files in `source/_posts/` become blog/portfolio entries
- **Scaffolds**: Templates in `scaffolds/` for creating new content:
  - `blog-post.md` - Standard blog post
  - `portfolio-post.md` - Portfolio project with gallery
  - `draft.md` - Unpublished draft

### Theme System
The custom "san-diego" theme (`themes/san-diego/`) consists of:
- **Templates**: EJS files in `layout/` for page structures
- **Styles**: SCSS in `source/styles/` with modular architecture
- **JavaScript**: Modular JS in `source/js/` for interactions
- **Scripts**: Build-time scripts in `scripts/` for processing

### Key Features Implementation
1. **Project Gallery**: Uses `project_gallery.ejs` with multiple layout modes
2. **Adaptive Videos**: Automatic video format conversion for web compatibility
3. **Image Optimization**: Sharp.js processes images on build
4. **Dark/Light Mode**: CSS custom properties with JavaScript toggle
5. **Performance**: Lazy loading, minification, and caching strategies

### Deployment Pipeline
GitHub Actions workflow (`.github/workflows/optimize-and-deploy.yml`):
1. Triggers on push to main
2. Runs image optimization
3. Builds production site
4. Deploys to GitHub Pages

## Important Patterns

### Creating New Content
```bash
# New blog post
hexo new blog-post "Post Title"

# New portfolio project
hexo new portfolio-post "Project Name"
```

### Working with Images
- Place images in post folders: `source/_posts/post-name/`
- Use relative paths in Markdown: `![Alt text](./image.jpg)`
- Images are automatically optimized during build

### Video Guidelines
- Supported formats: MP4, WebM
- Place in post folders alongside images
- Use adaptive video component for responsive playback

### SCSS Architecture
- Variables in `_variables.scss`
- Component styles in individual files (e.g., `_project.scss`)
- Responsive breakpoints in `_device-breakpoints.scss`
- Theme modes in `theme-modes/` directory

## Performance Considerations
- All images are automatically compressed with Sharp.js
- HTML/CSS/JS are minified in production builds
- Lazy loading is implemented for images and videos
- Font loading is optimized with font-display: swap

## Anchor Links Implementation

### How Anchor Links Work
- Anchor links allow navigation to specific posts using hash fragments (e.g., `#post-Play-Next`)
- The anchor link handler is in `themes/san-diego/source/js/anchor-links-simple.js`
- Uses native `scrollIntoView()` method for smooth scrolling
- Automatically switches between blog/portfolio tabs if needed

### Creating Anchor Links
- Post IDs are generated from the filename: `Post-Name.md` becomes `#post-Post-Name`
- Link format in Markdown: `[Link text](#post-Post-Name)`
- The ID is case-sensitive and must match the filename exactly

### Important Notes
- Posts marked with `draft: true` won't be published and anchor links to them will fail
- Link posts with `short: true` are rendered inline on the homepage
- The script handles both mobile and desktop scrolling contexts

## Known Technical Debt

### 1. HTML Size Limitation
- **Issue**: When too many posts have `short: true`, the generated index.html can become very large
- **Impact**: Previously caused HTML truncation at ~138KB, breaking functionality
- **Current Fix**: Strip script/style tags from inline post content in `blog-posts.ejs`
- **Proper Solution**: Implement pagination (change `per_page: 0` to a reasonable number in `_config.yml`)

### 2. Duplicate Scroll Implementations
- **Issue**: Multiple files implement similar scroll functionality
- **Files**: `scroll.js`, `blog.js`, and `anchor-links-simple.js`
- **Impact**: Potential conflicts and maintenance overhead
- **Solution**: Consolidate scroll logic into a single utility module

### 3. Event Handler Conflicts
- **Issue**: Multiple scripts attach click handlers to anchor links
- **Current Fix**: Use capture phase in anchor-links-simple.js to intercept first
- **Proper Solution**: Implement a central event delegation system

### 4. Script Loading Order Dependencies
- **Issue**: Some scripts depend on others being loaded first (e.g., mobileTabs)
- **Impact**: Race conditions can cause features to fail intermittently
- **Solution**: Implement proper module system or use dynamic imports

### 5. Deprecated Sass API Warnings
- **Issue**: Build process shows "legacy-js-api" deprecation warnings
- **Impact**: Will break when Dart Sass 2.0.0 is released
- **Solution**: Update build configuration to use modern Sass API

### 6. Missing Error Handling
- **Issue**: Many scripts don't handle edge cases (missing elements, network failures)
- **Impact**: Silent failures that are hard to debug
- **Solution**: Add comprehensive error handling and user feedback