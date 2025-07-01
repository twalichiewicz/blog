# Development Guide

This guide covers everything you need to know to develop and maintain the thomas.design blog.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Project Structure](#project-structure)
4. [Content Management](#content-management)
5. [Theme Development](#theme-development)
6. [JavaScript Architecture](#javascript-architecture)
7. [SCSS Architecture](#scss-architecture)
8. [Testing & Debugging](#testing--debugging)
9. [Best Practices](#best-practices)
10. [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Git** for version control
- **Code editor** (VS Code recommended)
- **Browser DevTools** knowledge

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/twalichiewicz/blog.git
cd blog

# Install dependencies
npm install

# Start development server
npm run server

# Open http://localhost:4000
```

### Environment Setup

1. **VS Code Extensions** (recommended):
   - ESLint
   - Stylelint
   - Prettier
   - Markdown All in One
   - Hexo Utils

2. **Git Configuration**:
   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

## Development Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Conventions

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting changes
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Test additions
- `chore:` Maintenance tasks

### Development Commands

```bash
# Start development server with live reload
npm run server

# Build the site (development)
npm run build

# Build for production (with optimizations)
npm run build:prod

# Clean build artifacts
npm run clean

# Optimize images only
npm run optimize:images

# Lint SCSS files
npm run lint:scss
npm run lint:scss:fix

# Analyze build size
npm run analyze
```

## Project Structure

```
blog/
├── source/              # Content and assets
│   ├── _posts/         # Blog posts (Markdown)
│   ├── img/            # Global images
│   ├── media/          # Audio/video files
│   └── CNAME           # Custom domain
├── themes/san-diego/    # Custom theme
│   ├── layout/         # EJS templates
│   ├── source/         # Theme assets
│   └── scripts/        # Build processors
├── scripts/            # Hexo extensions
├── tools/              # Build tools
├── docs/               # Documentation
├── _config.yml         # Hexo configuration
├── package.json        # Dependencies
└── .github/            # GitHub Actions
```

### Key Directories

- **`source/_posts/`**: All content lives here
- **`themes/san-diego/layout/`**: Page templates
- **`themes/san-diego/source/js/`**: JavaScript modules
- **`themes/san-diego/source/styles/`**: SCSS files
- **`public/`**: Generated site (git ignored)

## Content Management

### Creating Posts

```bash
# Blog post
hexo new blog-post "My New Blog Post"

# Portfolio project
hexo new portfolio-post "My New Project"

# Draft (won't be published)
hexo new draft "Work in Progress"
```

### Post Front Matter

#### Blog Post
```yaml
---
title: "My Blog Post"
date: 2024-06-19
tags:
  - design
  - development
categories:
  - tutorials
excerpt: "Brief description for previews"
cover_image: ./cover.jpg
---
```

#### Portfolio Project
```yaml
---
layout: project_gallery
title: "Project Name"
date: 2024-06-19
company: "Company Name"
byline: "Brief project description"
tags:
  - portfolio
  - ux-design

# Video trailer
trailer:
  type: video
  url: ./trailer.mp4
  poster: ./poster.jpg
  autoplay: true
  loop: true

# Gallery media
gallery_images:
  - type: image
    url: ./screenshot1.jpg
    caption: "Feature description"
  - type: video
    url: ./demo.mp4
    caption: "Demo video"

# Project summary
summary:
  problem:
    title: "The Problem"
    content: "What needed solving"
  solution:
    title: "The Solution"
    content: "How we solved it"
---
```

### Asset Management

```bash
# Create post with assets folder
source/_posts/
├── my-post.md
└── my-post/           # Same name as post
    ├── image1.jpg
    ├── video.mp4
    └── document.pdf
```

Reference assets with relative paths:
```markdown
![Alt text](./image1.jpg)
[Download PDF](./document.pdf)
```

## Theme Development

### Template Structure

```
themes/san-diego/layout/
├── layout.ejs          # Base template
├── index.ejs           # Homepage
├── post.ejs            # Blog post
├── project.ejs         # Portfolio project
├── project_gallery.ejs # Gallery layout
└── _partial/           # Reusable components
    ├── head.ejs
    ├── nav.ejs
    ├── footer.ejs
    └── ...
```

### Creating Templates

```ejs
<!-- themes/san-diego/layout/_partial/custom-component.ejs -->
<div class="custom-component">
  <h2><%= title %></h2>
  <% if (items && items.length) { %>
    <ul>
      <% items.forEach(item => { %>
        <li><%= item.name %></li>
      <% }) %>
    </ul>
  <% } %>
</div>
```

Use in templates:
```ejs
<%- partial('_partial/custom-component', {
  title: 'My Component',
  items: [{name: 'Item 1'}, {name: 'Item 2'}]
}) %>
```

### Theme Configuration

Edit `themes/san-diego/_config.yml`:
```yaml
# Menu navigation
menu:
  Home: /
  About: /about
  Archive: /archive

# Social links
social:
  GitHub: https://github.com/username
  Twitter: https://twitter.com/username
```

## JavaScript Architecture

### Module Structure

```javascript
// themes/san-diego/source/js/main.js
import { initAnimations } from './utils/animations.js';
import { initCarousel } from './components/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initCarousel();
});
```

### Creating Components

```javascript
// themes/san-diego/source/js/components/my-component.js
export class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      this.handleClick(e);
    });
  }

  handleClick(event) {
    // Handle interaction
  }

  render() {
    // Update DOM
  }
}

// Export initialization function
export function initMyComponent() {
  const elements = document.querySelectorAll('.my-component');
  elements.forEach(el => new MyComponent(el));
}
```

### Event System

```javascript
// Use custom events for communication
const event = new CustomEvent('component:action', {
  detail: { data: 'value' }
});
document.dispatchEvent(event);

// Listen for events
document.addEventListener('component:action', (e) => {
  console.log(e.detail.data);
});
```

## SCSS Architecture

### File Organization

```scss
themes/san-diego/source/styles/
├── styles.scss         # Main entry point
├── _variables.scss     # Design tokens
├── _typography.scss    # Type system
├── _utilities.scss     # Helper classes
├── atoms/              # Basic elements
├── molecules/          # Components
├── organisms/          # Complex layouts
└── theme-modes/        # Dark/light themes
```

### Design Tokens

```scss
// _variables.scss
// Colors
$primary-color: hsl(43deg 40% 60%);
$text-color: hsl(24deg 3% 35%);

// Spacing (multiples of 3)
$space-xs: 6px;
$space-sm: 12px;
$space-md: 24px;
$space-lg: 36px;

// Typography
$font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono: 'SF Mono', Consolas, monospace;

// Breakpoints
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;
```

### Creating Components

```scss
// molecules/_card.scss
.card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: $space-md;
  box-shadow: $shadow-soft;

  &__title {
    font-size: 1.25rem;
    margin-bottom: $space-sm;
  }

  &__content {
    color: var(--text-secondary);
  }

  // Dark mode
  [data-color-scheme="dark"] & {
    background: var(--card-bg-dark);
  }
}
```

### Responsive Design

```scss
// Use mixins for breakpoints
@mixin mobile {
  @media (max-width: $mobile) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$mobile + 1px}) and (max-width: $tablet) {
    @content;
  }
}

// Usage
.component {
  padding: $space-lg;

  @include mobile {
    padding: $space-md;
  }
}
```

## Testing & Debugging

### Browser Testing

1. **Desktop Browsers**:
   - Chrome (primary)
   - Safari
   - Firefox
   - Edge

2. **Mobile Testing**:
   - iOS Safari
   - Chrome Android
   - Use DevTools device emulation

### Debug Mode

```javascript
// Add debug flag to localStorage
localStorage.setItem('debug', 'true');

// Check in code
const DEBUG = localStorage.getItem('debug') === 'true';
if (DEBUG) {
  console.log('Debug info:', data);
}
```

### Performance Testing

```bash
# Build and analyze
npm run build:prod
npm run analyze

# Check Lighthouse
# 1. Open site in Chrome
# 2. DevTools → Lighthouse
# 3. Run audit
```

### Common Issues

1. **Script Loading Order**:
   - Check script dependencies
   - Use defer/async appropriately
   - Initialize after DOM ready

2. **SCSS Compilation**:
   - Check for syntax errors
   - Verify import paths
   - Clear build cache

3. **Missing Assets**:
   - Check file paths
   - Verify asset processing
   - Check public/ output

## Best Practices

### Code Style

1. **JavaScript**:
   - Use ES6+ features
   - Prefer const/let over var
   - Use async/await for promises
   - Add JSDoc comments

2. **SCSS**:
   - Follow BEM naming
   - Use variables for values
   - Keep specificity low
   - Mobile-first approach

3. **Templates**:
   - Escape user content
   - Check for undefined
   - Use partials for reuse
   - Comment complex logic

### Performance

1. **Images**:
   - Optimize before commit
   - Use appropriate formats
   - Add width/height attributes
   - Implement lazy loading

2. **JavaScript**:
   - Minimize DOM queries
   - Debounce scroll/resize
   - Use event delegation
   - Load non-critical async

3. **CSS**:
   - Minimize specificity
   - Avoid !important
   - Use CSS variables
   - Purge unused styles

### Accessibility

1. **Semantic HTML**
2. **ARIA labels** where needed
3. **Keyboard navigation**
4. **Color contrast** (WCAG AA)
5. **Alt text** for images
6. **Focus indicators**

## Common Tasks

### Update Dependencies

```bash
# Check outdated
npm outdated

# Update package.json
npm update

# Update specific package
npm install package@latest
```

### Add New Feature

1. Create feature branch
2. Add/modify templates
3. Add styles to SCSS
4. Add JavaScript if needed
5. Test thoroughly
6. Create pull request

### Debug Production Build

```bash
# Build without minification
hexo clean
hexo generate
# Manually inspect public/ files

# Check for errors
npm run build 2> build-errors.log
```

### Optimize Performance

1. Run Lighthouse audit
2. Identify bottlenecks
3. Optimize images
4. Minimize JavaScript
5. Reduce CSS
6. Test improvements

## Troubleshooting

### Build Failures

```bash
# Clean and rebuild
hexo clean
rm -rf node_modules
npm install
npm run build
```

### Local Server Issues

```bash
# Kill existing process
lsof -ti:4000 | xargs kill -9

# Try different port
hexo server -p 4001
```

### Style Not Updating

1. Clear browser cache
2. Check SCSS compilation
3. Verify file imports
4. Check for errors

### JavaScript Errors

1. Check console for errors
2. Verify script loading
3. Check for undefined
4. Test in isolation

## Resources

- [Hexo Documentation](https://hexo.io/docs/)
- [EJS Documentation](https://ejs.co/)
- [Sass Documentation](https://sass-lang.com/documentation)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)

---

*For deployment procedures, see [DEPLOYMENT.md](./DEPLOYMENT.md)*  
*For theme details, see [THEME_ARCHITECTURE.md](./THEME_ARCHITECTURE.md)*