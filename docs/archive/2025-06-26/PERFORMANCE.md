# Performance Optimization Guide

This guide details the performance optimization strategies, tools, and best practices for the thomas.design blog.

## Table of Contents

1. [Performance Overview](#performance-overview)
2. [Build-Time Optimizations](#build-time-optimizations)
3. [Runtime Performance](#runtime-performance)
4. [Image Optimization](#image-optimization)
5. [Code Optimization](#code-optimization)
6. [Loading Strategies](#loading-strategies)
7. [Caching Strategies](#caching-strategies)
8. [Performance Monitoring](#performance-monitoring)
9. [Performance Budget](#performance-budget)
10. [Optimization Checklist](#optimization-checklist)

## Performance Overview

### Current Performance Metrics

- **Lighthouse Score**: 90+ (desktop), 85+ (mobile)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Cumulative Layout Shift**: < 0.1
- **Total Page Weight**: Variable (see HTML size issue)

### Performance Goals

1. **Speed**: Sub-second initial load
2. **Efficiency**: Minimal resource usage
3. **Smoothness**: 60fps interactions
4. **Reliability**: Consistent performance

## Build-Time Optimizations

### Image Optimization Pipeline

**Tool**: Sharp.js (`tools/optimize-images.js`)

```javascript
// Configuration
{
  quality: 85,           // JPEG quality
  compressionLevel: 9,   // PNG compression
  progressive: true,     // Progressive encoding
  mozjpeg: true         // Better JPEG compression
}
```

**Process**:
1. Scan `source/` for images
2. Skip if already optimized
3. Resize if > 1920x1080
4. Compress based on format
5. Replace only if smaller

**Usage**:
```bash
npm run optimize:images
```

### Asset Minification

**Tool**: hexo-minify

```yaml
# _config.yml
minify:
  enable: true
  preview: false
  exclude: ['*.min.*']
  
  js:
    enable: true
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
```

### Build Process Optimization

```bash
# Production build command
npm run build:prod

# What it does:
# 1. hexo clean      - Clear cache
# 2. hexo generate   - Build site
# 3. optimize:images - Compress images
# 4. minify assets   - Reduce file sizes
```

## Runtime Performance

### JavaScript Loading

**Strategy**: Progressive Enhancement

```html
<!-- Critical inline scripts -->
<script>
  // Minimal critical path JS
  document.documentElement.className = 'js';
</script>

<!-- Async main bundle -->
<script type="module" src="/js/main.js"></script>

<!-- Deferred non-critical -->
<script defer src="/js/analytics.js"></script>
```

### CSS Loading

**Strategy**: Critical CSS + Async Load

```html
<!-- Critical CSS inline -->
<style>
  /* Above-the-fold styles */
</style>

<!-- Main stylesheet -->
<link rel="preload" href="/css/styles.css" as="style">
<link rel="stylesheet" href="/css/styles.css">
```

### Font Loading

```css
/* Optimize font loading */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

## Image Optimization

### Responsive Images

```html
<!-- Picture element for art direction -->
<picture>
  <source media="(max-width: 768px)" 
          srcset="image-mobile.webp" 
          type="image/webp">
  <source media="(max-width: 768px)" 
          srcset="image-mobile.jpg">
  <source srcset="image-desktop.webp" 
          type="image/webp">
  <img src="image-desktop.jpg" 
       alt="Description"
       loading="lazy"
       decoding="async">
</picture>
```

### Lazy Loading

```html
<!-- Native lazy loading -->
<img src="image.jpg" 
     loading="lazy"
     alt="Description">

<!-- Video lazy loading -->
<video preload="none" 
       poster="poster.jpg">
  <source src="video.mp4">
</video>
```

### Image Formats

| Format | Use Case | Support |
|--------|----------|---------|
| WebP | Modern browsers | 95%+ |
| JPEG | Photos, compatibility | 100% |
| PNG | Transparency, logos | 100% |
| AVIF | Next-gen (future) | 70%+ |

### Optimization Guidelines

1. **Size images appropriately**
   - Max width: 1920px
   - Mobile: 768px max
   - Thumbnails: 400px

2. **Choose correct format**
   - Photos: JPEG
   - Graphics: PNG/SVG
   - Modern: WebP

3. **Compress aggressively**
   - JPEG: 85% quality
   - PNG: Max compression
   - WebP: 80% quality

## Code Optimization

### JavaScript Optimization

**Bundle Size Reduction**:
```javascript
// Use dynamic imports
const module = await import('./heavy-module.js');

// Tree-shakeable exports
export { specificFunction } from './utils';

// Avoid large dependencies
// Bad: import _ from 'lodash';
// Good: import debounce from 'lodash/debounce';
```

**Performance Patterns**:
```javascript
// Debounce expensive operations
const debouncedResize = debounce(() => {
  // Expensive operation
}, 250);

// Use requestAnimationFrame
function animate() {
  requestAnimationFrame(() => {
    // Animation logic
  });
}

// Intersection Observer for visibility
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load content
    }
  });
});
```

### CSS Optimization

**Efficient Selectors**:
```scss
// Good - low specificity
.component { }
.component__element { }

// Bad - high specificity
div.wrapper > ul.list > li.item > a { }

// Use CSS variables for theming
:root {
  --color-primary: #333;
}

.component {
  color: var(--color-primary);
}
```

**Critical CSS**:
```scss
// Above-the-fold styles
.hero {
  // Inline these styles
}

// Below-the-fold
.footer {
  // Load async
}
```

## Loading Strategies

### Resource Hints

```html
<!-- DNS Prefetch for external domains -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preconnect for critical origins -->
<link rel="preconnect" href="//cdn.example.com">

<!-- Preload critical resources -->
<link rel="preload" href="/css/critical.css" as="style">
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>

<!-- Prefetch next page resources -->
<link rel="prefetch" href="/next-page.html">
```

### Progressive Loading

```javascript
// 1. Load critical content
loadCriticalContent();

// 2. Load visible content
requestIdleCallback(() => {
  loadVisibleContent();
});

// 3. Prefetch future content
if ('connection' in navigator && navigator.connection.saveData === false) {
  prefetchFutureContent();
}
```

### Code Splitting

```javascript
// Route-based splitting
const loadBlogModule = () => import('./modules/blog.js');
const loadPortfolioModule = () => import('./modules/portfolio.js');

// Component-based splitting
const Carousel = lazy(() => import('./components/Carousel'));
```

## Caching Strategies

### Browser Caching

**Headers Configuration** (`_headers`):
```
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000

/
  Cache-Control: public, max-age=3600, must-revalidate
```

### Service Worker (Future)

```javascript
// Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/css/styles.css',
        '/js/main.js',
        '/offline.html'
      ]);
    })
  );
});
```

### CDN Strategy

- **GitHub Pages CDN**: Automatic
- **CloudFlare**: Optional enhancement
- **Asset versioning**: Via build hash

## Performance Monitoring

### Metrics to Track

1. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. **Custom Metrics**
   - Time to first post
   - Gallery load time
   - Search response time

### Monitoring Tools

```javascript
// Performance Observer
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure'] });

// Custom timing
performance.mark('gallery-start');
loadGallery();
performance.mark('gallery-end');
performance.measure('gallery-load', 'gallery-start', 'gallery-end');
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://thomas.design
      https://thomas.design/portfolio
    uploadArtifacts: true
```

## Performance Budget

### Size Budgets

| Resource | Budget | Current |
|----------|--------|---------|
| HTML | 50KB | Variable |
| CSS | 30KB | ~25KB |
| JS | 100KB | ~80KB |
| Images | 200KB/image | Optimized |
| Total | 1MB | Variable |

### Timing Budgets

| Metric | Budget | Target |
|--------|--------|--------|
| FCP | 1.5s | < 1s |
| TTI | 3.5s | < 2s |
| LCP | 2.5s | < 2s |
| FID | 100ms | < 50ms |

### Enforcement

```javascript
// Budget check script
const checkBudget = () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  
  if (perfData.loadEventEnd > 3500) {
    console.warn('Page load exceeded budget!');
  }
};
```

## Optimization Checklist

### Pre-Deploy

- [ ] Run image optimization
- [ ] Check bundle sizes
- [ ] Verify lazy loading
- [ ] Test on slow connection
- [ ] Run Lighthouse audit

### Code Review

- [ ] No unused CSS/JS
- [ ] Images have dimensions
- [ ] Async/defer scripts
- [ ] Resource hints added
- [ ] Critical CSS extracted

### Testing

- [ ] Test on real devices
- [ ] Check network throttling
- [ ] Verify cache headers
- [ ] Monitor metrics
- [ ] Check error rates

### Post-Deploy

- [ ] Monitor RUM data
- [ ] Check CDN performance
- [ ] Verify caching works
- [ ] Track Core Web Vitals
- [ ] User feedback

## Advanced Optimizations

### Edge Computing (Future)

```javascript
// Cloudflare Workers example
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Cache API responses
  const cache = caches.default;
  let response = await cache.match(request);
  
  if (!response) {
    response = await fetch(request);
    event.waitUntil(cache.put(request, response.clone()));
  }
  
  return response;
}
```

### Resource Priority

```html
<!-- High priority -->
<link rel="preload" href="/css/critical.css" as="style">

<!-- Low priority -->
<link rel="prefetch" href="/js/analytics.js">

<!-- Lazy load -->
<script loading="lazy" src="/js/comments.js"></script>
```

### Modern Features

```javascript
// Use CSS containment
.post {
  contain: layout style paint;
}

// Use content-visibility
.below-fold {
  content-visibility: auto;
}

// Use will-change sparingly
.animating {
  will-change: transform;
}
```

## Debugging Performance

### Chrome DevTools

1. **Performance Panel**
   - Record page load
   - Analyze flame graphs
   - Find bottlenecks

2. **Network Panel**
   - Check sizes
   - Verify compression
   - Monitor timing

3. **Coverage Panel**
   - Find unused code
   - Optimize bundles

### Common Issues

1. **Large DOM**
   - Virtualize lists
   - Lazy render content
   - Remove unused nodes

2. **Memory Leaks**
   - Remove event listeners
   - Clear timers
   - Dispose objects

3. **Render Blocking**
   - Async CSS/JS
   - Optimize critical path
   - Defer non-critical

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

*For more documentation, see [docs/README.md](./README.md)*