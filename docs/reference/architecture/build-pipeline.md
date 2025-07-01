# Build Pipeline Architecture

Technical reference for the Thomas.design build system.

## Overview

The build pipeline transforms source content (Markdown, media, demos) into an optimized static website using Hexo and custom processors.

## Build Stages

### 1. Pre-processing
```
Source Files → Optimization → Processed Files
```

- **Image optimization**: Sharp.js processes images >500KB
- **Video conversion**: Ensures web-compatible formats
- **Demo building**: Compiles all interactive demos

### 2. Generation
```
Markdown + Templates → HTML Pages
```

- **Hexo core**: Converts Markdown to HTML
- **Theme processing**: Applies san-diego theme
- **Plugin execution**: Custom tags and filters

### 3. Post-processing
```
Generated HTML → Minification → Production Build
```

- **Asset minification**: HTML, CSS, JS compression
- **Path resolution**: Fixes relative paths
- **Bundle optimization**: Combines and splits assets

## Key Components

### Hexo Configuration (`_config.yml`)
```yaml
# Core settings
theme: san-diego
per_page: 10
pagination_dir: page

# Build optimizations
minify:
  enable: true
  preview: false
  
# Image handling  
lazyload:
  enable: true
```

### Theme Processors

#### 1. Minify Assets (`scripts/minify-assets.js`)
- Runs after Hexo generation
- Compresses CSS/JS files
- Handles source maps

#### 2. Video Processor (`scripts/video.js`)
- Creates adaptive video tags
- Generates multiple sources
- Adds loading strategies

#### 3. Carousel Generator (`scripts/carousel.js`)
- Processes image arrays
- Creates gallery markup
- Adds navigation controls

### Build Scripts

#### Main Build (`package.json`)
```json
{
  "scripts": {
    "build": "hexo clean && hexo generate",
    "build:prod": "npm run build && npm run build:demos",
    "build:demos": "node demos/build-scripts/build-all-demos.js"
  }
}
```

#### Demo Builder (`demos/build-scripts/build-all-demos.js`)
- Iterates through demo folders
- Runs Vite builds
- Validates output structure

#### Image Optimizer (`tools/optimize-images.js`)
- Uses Sharp.js for compression
- Maintains aspect ratios
- Skips small files (<10KB)

## Build Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Source    │ --> │ Pre-process  │ --> │  Generate   │
│  Content    │     │  Optimize    │     │   HTML      │
└─────────────┘     └──────────────┘     └─────────────┘
                            |
                            v
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Deploy    │ <-- │ Post-process │ <-- │   Bundle    │
│  to GH      │     │   Minify     │     │  Assets     │
└─────────────┘     └──────────────┘     └─────────────┘
```

## File Processing

### Markdown Files
1. Front matter extraction
2. Content rendering
3. Template application
4. Layout wrapping

### Media Files
1. Size checking
2. Format validation
3. Optimization
4. Path updating

### Demo Projects
1. Dependency installation
2. Vite build process
3. Output validation
4. Integration testing

## Performance Optimizations

### Lazy Loading
- Images use intersection observer
- Placeholder SVGs during load
- Progressive enhancement

### Minification
- HTML: Remove comments, collapse whitespace
- CSS: Remove unused styles, combine rules
- JS: Tree shaking, dead code elimination

### Caching Strategy
- Static assets: 1 year cache
- HTML files: No cache
- Service worker: Offline support

## Build Environments

### Development
```bash
npm run server
```
- No minification
- Source maps enabled
- Hot reload active
- Drafts visible

### Production
```bash
npm run build:prod
```
- Full optimization
- No source maps
- Compressed assets
- No drafts

### CI/CD
```yaml
# .github/workflows/optimize-and-deploy.yml
- run: npm ci
- run: npm run optimize:images
- run: npm run build:prod
- run: npm run deploy
```

## Troubleshooting

### Common Build Issues

#### Out of Memory
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Sharp Installation
```bash
npm rebuild sharp
```

#### Demo Build Failures
```bash
cd demos/problem-demo
npm install
npm run build
```

## Extension Points

### Custom Processors
Create in `themes/san-diego/scripts/`:
```javascript
hexo.extend.filter.register('after_generate', function(){
  // Custom processing
});
```

### Build Hooks
- `before_generate`: Pre-processing
- `after_generate`: Post-processing
- `before_deploy`: Pre-deployment

### Plugin Development
1. Create in `scripts/` folder
2. Register with Hexo API
3. Access to full site data

## Performance Metrics

### Target Metrics
- Build time: <2 minutes
- Page size: <1MB
- Asset optimization: >30% reduction
- Lighthouse score: >90

### Monitoring
```bash
# Build analysis
npm run analyze

# Performance testing
npm run test:performance
```

## Related Documentation

- [Theme System](./theme-system.md)
- [Demo System](./demo-system.md)
- [Deployment Guide](../../guides/development/deployment.md)
- [Performance Guide](../../guides/maintenance/performance-optimization.md)