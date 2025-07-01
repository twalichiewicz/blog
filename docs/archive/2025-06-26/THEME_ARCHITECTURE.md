# Theme Architecture Documentation

This document provides a comprehensive overview of the "san-diego" theme architecture for the thomas.design blog.

## Table of Contents

1. [Theme Overview](#theme-overview)
2. [Directory Structure](#directory-structure)
3. [Template System](#template-system)
4. [Component Architecture](#component-architecture)
5. [Styling System](#styling-system)
6. [JavaScript Modules](#javascript-modules)
7. [Build Processing](#build-processing)
8. [Theme Configuration](#theme-configuration)
9. [Extension Points](#extension-points)
10. [Best Practices](#best-practices)

## Theme Overview

The san-diego theme is a custom-built Hexo theme designed specifically for the thomas.design blog. It features:

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark/Light Modes**: System-aware theme switching
- **Rich Media Support**: Advanced galleries, video players, carousels
- **Performance Optimized**: Lazy loading, critical CSS, minimal JavaScript
- **Accessibility**: WCAG AA compliant with keyboard navigation

### Design Philosophy

1. **Content First**: Typography and readability prioritized
2. **Progressive Enhancement**: Core functionality without JavaScript
3. **Modular Architecture**: Reusable components and utilities
4. **Performance Budget**: Every feature must justify its weight

## Directory Structure

```
themes/san-diego/
├── _config.yml              # Theme configuration
├── languages/               # i18n support
│   └── default.yml         # English strings
├── layout/                  # EJS templates
│   ├── _partial/           # Reusable components
│   ├── layout.ejs          # Base template
│   ├── index.ejs           # Homepage
│   ├── post.ejs            # Blog post
│   ├── project.ejs         # Portfolio project
│   └── project_gallery.ejs # Gallery layout
├── scripts/                 # Build-time processors
│   ├── carousel.js         # Carousel tag processor
│   ├── emoji-processor.js  # Emoji optimization
│   └── video.js            # Video tag processor
└── source/                  # Theme assets
    ├── css/                # Compiled CSS (git ignored)
    ├── js/                 # JavaScript modules
    └── styles/             # SCSS source files
```

## Template System

### Template Hierarchy

```
layout.ejs (base)
  ├── index.ejs (homepage)
  ├── post.ejs (blog post)
  ├── project.ejs (portfolio)
  ├── project_gallery.ejs (gallery)
  ├── archive.ejs (archive)
  └── 404.ejs (error page)
```

### Base Layout

```ejs
<!-- layout/layout.ejs -->
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
    <%- partial('_partial/head') %>
</head>
<body>
    <%- partial('_partial/skip-navigation') %>
    <%- body %>
    <script type="module" src="<%- url_for('js/main.js') %>"></script>
</body>
</html>
```

### Partial Components

Key partials in `layout/_partial/`:

- **head.ejs**: Meta tags, SEO, resource loading
- **nav.ejs**: Navigation menu
- **footer.ejs**: Site footer
- **profile-header.ejs**: Author bio section
- **blog-posts.ejs**: Post listing logic
- **portfolio-projects.ejs**: Project grid
- **carousel.ejs**: Media carousel
- **search.ejs**: Search interface

### Template Data

Templates receive data from Hexo:

```ejs
<!-- Available variables -->
<%= config %>      <!-- Site configuration -->
<%= theme %>       <!-- Theme configuration -->
<%= page %>        <!-- Current page data -->
<%= site %>        <!-- Site metadata -->
<%= url_for() %>   <!-- URL helper -->
<%= partial() %>   <!-- Partial helper -->
```

## Component Architecture

### Component Types

1. **Layout Components**: Structure and containers
2. **Content Components**: Posts, projects, galleries
3. **Interactive Components**: Carousels, tabs, modals
4. **Utility Components**: Loading states, tooltips

### Component Example: Carousel

```ejs
<!-- layout/_partial/carousel.ejs -->
<div class="carousel" data-carousel>
  <div class="carousel-track">
    <% items.forEach((item, index) => { %>
      <div class="carousel-slide <%= index === 0 ? 'active' : '' %>">
        <% if (item.type === 'video') { %>
          <video src="<%= item.url %>" <%= item.autoplay ? 'autoplay' : '' %>>
        <% } else { %>
          <img src="<%= item.url %>" alt="<%= item.alt %>">
        <% } %>
      </div>
    <% }) %>
  </div>
  <div class="carousel-controls">
    <button class="carousel-prev">Previous</button>
    <button class="carousel-next">Next</button>
  </div>
</div>
```

### Component Composition

```ejs
<!-- Composing components -->
<%- partial('_partial/hero', {
  title: page.title,
  subtitle: page.subtitle,
  image: page.cover_image
}) %>

<%- partial('_partial/content', {
  content: page.content,
  showToc: true
}) %>

<%- partial('_partial/related-posts', {
  posts: site.related_posts(page),
  limit: 3
}) %>
```

## Styling System

### SCSS Architecture

```
styles/
├── styles.scss              # Main entry point
├── _variables.scss          # Design tokens
├── _typography.scss         # Type system
├── _utilities.scss          # Helper classes
├── atoms/                   # Basic elements
│   ├── _buttons.scss
│   └── _inputs.scss
├── molecules/               # Components
│   ├── _cards.scss
│   └── _navigation.scss
├── organisms/               # Complex layouts
│   ├── _header.scss
│   └── _footer.scss
└── theme-modes/            # Theme variations
    ├── light-mode.scss
    └── dark-mode.scss
```

### Design Tokens

```scss
// _variables.scss
// Color System
$primary-color: hsl(43deg 40% 60%);
$text-color: hsl(24deg 3% 35%);
$background-color: hsl(35deg 15% 88%);

// Spacing System (3px base)
$space-unit: 3px;
$space-xs: $space-unit * 2;   // 6px
$space-sm: $space-unit * 4;   // 12px
$space-md: $space-unit * 8;   // 24px
$space-lg: $space-unit * 12;  // 36px

// Typography Scale
$font-size-base: 16px;
$font-scale: 1.25;
$font-size-sm: $font-size-base / $font-scale;
$font-size-lg: $font-size-base * $font-scale;

// Breakpoints
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1200px;
```

### Theme Modes

```scss
// theme-modes/light-mode.scss
:root {
  --color-background: #{$background-color};
  --color-text: #{$text-color};
  --color-primary: #{$primary-color};
}

// theme-modes/dark-mode.scss
[data-color-scheme="dark"] {
  --color-background: hsl(28deg 8% 15%);
  --color-text: hsl(0deg 0% 95%);
  --color-primary: hsl(43deg 50% 50%);
}
```

### Component Styling

```scss
// molecules/_card.scss
.card {
  background: var(--color-surface);
  border-radius: 8px;
  padding: $space-md;
  box-shadow: $shadow-soft;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }

  &__title {
    font-size: $font-size-lg;
    margin-bottom: $space-sm;
    color: var(--color-text);
  }

  &__content {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  // Variants
  &--featured {
    border: 2px solid var(--color-primary);
  }

  // Responsive
  @include mobile {
    padding: $space-sm;
  }
}
```

## JavaScript Modules

### Module Organization

```
js/
├── main.js                  # Entry point
├── components/              # UI components
│   ├── carousel.js
│   ├── adaptive-video.js
│   └── interactive-quote.js
├── utils/                   # Utilities
│   ├── animations.js
│   ├── color-scheme.js
│   └── sound-effects.js
└── core/                    # Core functionality
    └── navigation.js
```

### Module Pattern

```javascript
// components/carousel.js
export class Carousel {
  constructor(element) {
    this.element = element;
    this.slides = element.querySelectorAll('.carousel-slide');
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateSlide();
  }

  bindEvents() {
    this.element.querySelector('.carousel-next')
      ?.addEventListener('click', () => this.next());
    
    this.element.querySelector('.carousel-prev')
      ?.addEventListener('click', () => this.prev());
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  updateSlide() {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentIndex);
    });
  }
}

// Initialize all carousels
export function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(el => {
    new Carousel(el);
  });
}
```

### Event System

```javascript
// utils/events.js
export class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus();
```

## Build Processing

### Tag Processors

```javascript
// scripts/carousel.js
hexo.extend.tag.register('carousel', function(args) {
  const images = JSON.parse(args.join(' '));
  
  return `
    <div class="carousel">
      ${images.map(img => `
        <img src="${img.url}" alt="${img.alt}">
      `).join('')}
    </div>
  `;
}, { ends: false });
```

### Filter Processors

```javascript
// scripts/emoji-processor.js
hexo.extend.filter.register('after_render:html', function(html) {
  // Replace emoji shortcodes with images
  return html.replace(/:(\w+):/g, (match, emoji) => {
    return `<img class="emoji" src="/img/emojis/${emoji}.svg" alt="${emoji}">`;
  });
});
```

### Helper Functions

```javascript
// scripts/helpers.js
hexo.extend.helper.register('format_date', function(date, format) {
  return moment(date).format(format || 'MMMM D, YYYY');
});

hexo.extend.helper.register('excerpt', function(post, length) {
  const excerpt = post.excerpt || post.content;
  return excerpt.substring(0, length || 200) + '...';
});
```

## Theme Configuration

### Theme Config File

```yaml
# themes/san-diego/_config.yml
# Menu
menu:
  Home: /
  Blog: /blog
  Portfolio: /portfolio
  About: /about

# Social links
social:
  GitHub: https://github.com/username
  Twitter: https://twitter.com/username
  LinkedIn: https://linkedin.com/in/username

# Features
features:
  dark_mode: true
  search: true
  comments: false
  analytics: true

# Performance
performance:
  lazy_load: true
  critical_css: true
  prefetch: true
```

### Accessing Config

```ejs
<!-- In templates -->
<% if (theme.features.dark_mode) { %>
  <%- partial('_partial/theme-toggle') %>
<% } %>

<!-- Menu generation -->
<nav>
  <% for (const [name, url] of Object.entries(theme.menu)) { %>
    <a href="<%- url_for(url) %>"><%= name %></a>
  <% } %>
</nav>
```

## Extension Points

### Custom Layouts

```javascript
// Add custom layout
hexo.extend.generator.register('custom', function(locals) {
  return {
    path: 'custom/index.html',
    layout: ['custom', 'index'],
    data: {
      title: 'Custom Page',
      posts: locals.posts
    }
  };
});
```

### Widget System

```ejs
<!-- layout/_partial/widget.ejs -->
<div class="widget widget-<%= widget.type %>">
  <% if (widget.type === 'recent-posts') { %>
    <%- partial('_widget/recent-posts', { posts: site.posts.limit(5) }) %>
  <% } else if (widget.type === 'tags') { %>
    <%- partial('_widget/tags', { tags: site.tags }) %>
  <% } %>
</div>
```

### Theme API

```javascript
// Expose theme API
window.theme = {
  // Theme switching
  setColorScheme(scheme) {
    document.body.setAttribute('data-color-scheme', scheme);
    localStorage.setItem('theme', scheme);
  },

  // Component initialization
  initComponent(name, element) {
    const Component = this.components[name];
    if (Component) {
      return new Component(element);
    }
  },

  // Event system
  on(event, callback) {
    eventBus.on(event, callback);
  },

  emit(event, data) {
    eventBus.emit(event, data);
  }
};
```

## Best Practices

### Template Guidelines

1. **Use partials** for reusable components
2. **Escape user content** with `<%- %>` for HTML, `<%= %>` for text
3. **Check for existence** before using variables
4. **Minimize logic** in templates
5. **Comment complex sections**

### Styling Guidelines

1. **Use CSS variables** for theming
2. **Follow BEM naming** convention
3. **Mobile-first** media queries
4. **Minimize specificity**
5. **Document mixins** and functions

### JavaScript Guidelines

1. **Use ES modules** for organization
2. **Progressive enhancement** approach
3. **Event delegation** for dynamic content
4. **Lazy load** non-critical features
5. **Handle errors** gracefully

### Performance Guidelines

1. **Inline critical CSS**
2. **Lazy load images** and videos
3. **Minimize JavaScript** bundle size
4. **Use resource hints** for performance
5. **Cache static assets** aggressively

### Accessibility Guidelines

1. **Semantic HTML** structure
2. **ARIA labels** for interactive elements
3. **Keyboard navigation** support
4. **Focus indicators** visible
5. **Color contrast** WCAG AA compliant

## Customization Examples

### Adding a New Layout

```ejs
<!-- layout/custom.ejs -->
<div class="custom-layout">
  <h1><%= page.title %></h1>
  
  <div class="custom-content">
    <%- page.content %>
  </div>
  
  <% if (page.features) { %>
    <div class="features">
      <% page.features.forEach(feature => { %>
        <%- partial('_partial/feature', { feature }) %>
      <% }) %>
    </div>
  <% } %>
</div>
```

### Creating a Component

```javascript
// js/components/tabs.js
export class Tabs {
  constructor(element) {
    this.element = element;
    this.tabs = element.querySelectorAll('[role="tab"]');
    this.panels = element.querySelectorAll('[role="tabpanel"]');
    this.init();
  }

  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.selectTab(index));
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }

  selectTab(index) {
    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected);
      this.panels[i].hidden = !isSelected;
    });
  }

  handleKeydown(event, index) {
    // Arrow key navigation
    if (event.key === 'ArrowRight') {
      this.selectTab((index + 1) % this.tabs.length);
    } else if (event.key === 'ArrowLeft') {
      this.selectTab((index - 1 + this.tabs.length) % this.tabs.length);
    }
  }
}
```

### Extending Styles

```scss
// styles/custom/_my-component.scss
.my-component {
  @include component-base;
  
  background: var(--color-surface);
  padding: $space-md;
  
  &__title {
    @include heading-styles;
    margin-bottom: $space-sm;
  }
  
  &__content {
    @include content-styles;
  }
  
  // States
  &.is-active {
    border-color: var(--color-primary);
  }
  
  // Themes
  [data-color-scheme="dark"] & {
    background: var(--color-surface-dark);
  }
}
```

## Resources

- [Hexo Theme Development](https://hexo.io/docs/themes)
- [EJS Documentation](https://ejs.co/)
- [Sass Guidelines](https://sass-guidelin.es/)
- [BEM Methodology](http://getbem.com/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

*For more documentation, see [docs/README.md](./README.md)*