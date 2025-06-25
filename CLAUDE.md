# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Table of Contents

1. [🚨 Critical Rules & Warnings](#-critical-rules--warnings)
2. [Quick Start](#quick-start)
3. [Project Architecture](#project-architecture)
4. [Development Guide](#development-guide)
5. [Component Systems](#component-systems)
6. [Styling Guidelines](#styling-guidelines)
7. [Testing & Quality](#testing--quality)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)
11. [Technical Debt Registry](#technical-debt-registry)

## 🚨 Critical Rules & Warnings

### Build Requirements
**ALWAYS run `npm run build` before committing ANY changes**
- If build fails → DO NOT commit or push
- Fix all errors first
- This is a hard blocker - no exceptions
- Test locally before deployment

### File Purpose Boundaries
Each SCSS file has a specific purpose. NEVER cross these boundaries:
- `_dynamic-content-scroll-fix.scss`: ONLY for fixing scroll behavior, NO styling
- `_blog.scss`: Component styling for blog elements
- `_project.scss`: Component styling for project elements
- `_mobile-scroll-fix.scss`: Mobile-specific scroll fixes only

### Respecting Constraints
**THE MOST IMPORTANT RULE**: When given a specific task with constraints, DO NOT make changes outside those boundaries.
- If told not to touch something, DON'T
- Fix only what was asked, nothing more
- When user says something works, study it but don't modify it

### Security Rules
- NEVER introduce code that exposes or logs secrets/keys
- NEVER commit secrets or keys to the repository
- Always follow security best practices

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Git
- npm or yarn

### Project Overview
This is a Hexo-powered static blog and portfolio site for Thomas Walichiewicz. Hexo converts Markdown posts into a static website with a custom theme called "san-diego".

### Initial Setup
```bash
# Clone the repository
git clone [repository-url]
cd blog

# Install dependencies
npm install

# Start development server
npm run server

# Build for production
npm run build:prod
```

### Common Commands Reference
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

# Demo Development
npm run build:demos    # Build all demo projects
npm run dev:demos      # Start demo development servers

# Optimization
npm run optimize:images # Optimize images in source/_posts/
npm run analyze        # Analyze build size
```

## Project Architecture

### Directory Structure
```
blog/
├── source/
│   ├── _posts/          # Blog and portfolio content
│   └── assets/          # Global assets
├── themes/san-diego/    # Custom theme
│   ├── layout/          # EJS templates
│   ├── source/
│   │   ├── styles/      # SCSS files
│   │   ├── js/          # JavaScript modules
│   │   └── components/  # Component library
│   └── scripts/         # Build-time scripts
├── scaffolds/           # Content templates
├── demos/               # Interactive demo projects
├── tools/               # Utility scripts
│   ├── blog-editor/     # Remote editor
│   └── optimize-images.js
├── _config.yml          # Hexo configuration
├── package.json
└── CLAUDE.md           # This file
```

### Core Concepts

#### Content Management
- **Posts**: Markdown files in `source/_posts/` become blog/portfolio entries
- **Scaffolds**: Templates in `scaffolds/` for creating new content:
  - `blog-post.md` - Standard blog post
  - `portfolio-post.md` - Portfolio project with gallery
  - `draft.md` - Unpublished draft
  - `case-study.md` - Detailed case studies
  - `page.md` - Static pages

#### Theme System
The custom "san-diego" theme consists of:
- **Templates**: EJS files in `layout/` for page structures
- **Styles**: SCSS in `source/styles/` with modular architecture
- **JavaScript**: Modular JS in `source/js/` for interactions
- **Scripts**: Build-time scripts in `scripts/` for processing

#### Build Pipeline
1. **Hexo Generation**: Converts Markdown to HTML
2. **Asset Processing**: Custom minification script (`scripts/minify-assets.js`)
3. **Image Optimization**: Sharp.js processes images (`tools/optimize-images.js`)
4. **Deployment**: GitHub Actions workflow to GitHub Pages

### Key Features
1. **Project Gallery**: Uses `project_gallery.ejs` with multiple layout modes
2. **Interactive Demo System**: Self-contained demos that load in place of project trailers
3. **Adaptive Videos**: Automatic video format conversion for web compatibility
4. **Image Optimization**: Sharp.js processes images on build
5. **Dark/Light Mode**: CSS custom properties with prefers-color-scheme
6. **Performance**: Lazy loading, minification, and caching strategies
7. **Remote Editor**: Secure blog editor in `tools/blog-editor/` with GitHub OAuth

## Development Guide

### Creating New Content
```bash
# New blog post
hexo new blog-post "Post Title"

# New portfolio project
hexo new portfolio-post "Project Name"

# New case study
hexo new case-study "Study Title"
```

### Working with Media

#### Images
- Place images in post folders: `source/_posts/post-name/`
- Use relative paths in Markdown: `![Alt text](./image.jpg)`
- Images are automatically optimized during build
- Small files (<10KB) are skipped from optimization

#### Videos
- Supported formats: MP4, WebM
- Place in post folders alongside images
- Use adaptive video component for responsive playback
- Different aspect ratios for various grid layouts

### Process Management

#### Cleaning Up Development Processes
When switching between tasks or experiencing high CPU/memory usage:
```bash
# Check for running Node.js processes
ps aux | grep node

# Kill specific process by PID
kill -9 [PID]

# Check port 4000 usage (Hexo default)
lsof -i :4000

# Force kill process using port 4000
kill -9 $(lsof -t -i:4000)
```

#### Best Practices
- Always use Ctrl+C to properly stop development servers
- Check for running processes before starting new ones
- Close terminal sessions cleanly
- Monitor Activity Monitor (Mac) for Node processes

### Anchor Links
- Post IDs are generated from filename: `Post-Name.md` → `#post-Post-Name`
- Link format: `[Link text](#post-Post-Name)`
- IDs are case-sensitive and must match filename exactly
- Posts with `draft: true` won't be published
- Posts with `short: true` are rendered inline

## Component Systems

### Component Library
A custom micro-component library built specifically for Hexo:

#### Directory Structure
```
themes/san-diego/source/components/
├── index.js              # Main JS entry point
├── index.scss            # Main SCSS entry point  
├── utilities/
│   └── base-component.js # Base class for all components
├── tokens/
│   └── _design-tokens.scss # Design system tokens
└── core/
    └── button/          # Example component
        ├── button.js    # Component logic
        ├── button.scss  # Component styles
        └── button.ejs   # Component template
```

#### Creating New Components
1. Create component directory: `mkdir -p themes/san-diego/source/components/core/[name]`
2. Add three files: `.js`, `.scss`, `.ejs`
3. Import styles in `components/index.scss`
4. Use in templates with EJS includes

### Custom Hexo Tag Plugins
Available in `themes/san-diego/scripts/`:
- **video**: Multi-format video embedding
- **carousel**: Image/video carousel generation
- **image-caption**: Automatic image captions
- **process-alerts**: Alert boxes (info, warning, success, danger)
- **wave-text**: Animated text effects
- **emoji-processor**: Enhanced emoji handling

### Interactive Demo System
Self-contained demos that load in place of project trailers:

#### Demo Architecture
```
demos/
├── build-scripts/          # Build automation
│   ├── build-all-demos.js # Builds all demos
│   └── watch-demos.js     # Development servers
├── shared/                 # Shared demo components
│   ├── components/         # Reusable UI components
│   │   ├── DemoWrapper.jsx # Complete demo wrapper
│   │   ├── BrowserChrome.jsx # Browser window chrome
│   │   └── demo-wrapper.css # Shared styles
│   ├── examples/           # Usage examples
│   └── README.md          # Component documentation
├── examples/               # Demo templates
│   └── react-demo-template/
├── [project-demos]/        # Individual demo projects
└── README.md
```

#### Demo Wrapper System
A standardized browser chrome and background system for all portfolio demos:

##### Using the Demo Wrapper
```jsx
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function App() {
  return (
    <DemoWrapper url="app.example.com">
      <YourDemoContent />
    </DemoWrapper>
  );
}
```

##### Available Props
- `url` - URL to display in browser address bar
- `browserTheme` - Chrome style: 'mac' (default), 'windows', 'minimal'
- `showBackground` - Show grid background pattern (default: true)
- `backgroundStyle` - Custom background CSS styles
- `className` - Additional CSS classes

##### Browser Themes
1. **Mac Theme** (default) - macOS-style with colored window controls
2. **Windows Theme** - Windows-style with right-aligned controls
3. **Minimal Theme** - Clean header with no window controls

##### Background Patterns
- Default: Grid pattern (like Custom Install demo)
- `.demo-background--dots`: Dot pattern
- `.demo-background--diagonal`: Diagonal lines
- Custom: Pass `backgroundStyle` prop

##### Example Configurations
```jsx
// Autodesk style
<DemoWrapper url="manage.autodesk.com/products">
  <AutodeskDemo />
</DemoWrapper>

// Windows enterprise app
<DemoWrapper 
  url="enterprise.app/dashboard"
  browserTheme="windows"
>
  <EnterpriseApp />
</DemoWrapper>

// Minimal prototype
<DemoWrapper 
  url="prototype.local"
  browserTheme="minimal"
  showBackground={false}
>
  <Prototype />
</DemoWrapper>
```

#### Migrating Existing Demos to Shared Components

##### Quick Migration Steps
1. Import shared components:
   ```jsx
   import { DemoWrapper } from '@portfolio/demo-shared';
   import '@portfolio/demo-shared/styles';
   ```

2. Replace custom wrapper with DemoWrapper:
   ```jsx
   // Before
   <div className="custom-wrapper">
     <YourDemo />
   </div>
   
   // After
   <DemoWrapper url="your.demo.url">
     <YourDemo />
   </DemoWrapper>
   ```

3. Remove duplicate styles (browser chrome, backgrounds)

4. Keep demo-specific styles only

#### Creating a New Demo

##### 1. Setup from Template
```bash
# Copy React template
cp -r demos/examples/react-demo-template demos/my-project-demo
cd demos/my-project-demo

# Update package.json
# Change name, description, and port (use unique ports: 3001, 3002, etc.)
```

##### 2. Configure Vite
Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: './',  // CRITICAL: Use relative paths for assets
  server: {
    port: 3002,  // Unique port for each demo
  }
})
```

##### 3. Demo Structure
Typical demo components:
```
src/
├── App.jsx              # Main app component
├── App.css              # Global styles
└── components/
    ├── Feature1.jsx     # Feature demonstrations
    ├── Feature2.jsx
    └── styles/          # Component styles
```

##### 4. Enable in Portfolio Post
Add to project front matter:
```yaml
demo_component: "my-project-demo"
# or for external demos:
demo_url: "https://codepen.io/example"
```

#### Building Demos

##### Development Workflow
```bash
# Start all demo dev servers
npm run dev:demos

# Start specific demo
cd demos/my-project-demo && npm run dev

# Start blog dev server (separate terminal)
npm run server
```

##### Production Build
```bash
# Build all demos (from root)
npm run build:demos

# Build specific demo
cd demos/my-project-demo && npm run build

# Build blog with demos
npm run build
```

#### Demo Requirements
- **Build Output**: Must build to `dist/` with `index.html`
- **Asset Paths**: Use relative paths (`base: './'` in Vite)
- **Self-contained**: No external runtime dependencies
- **Responsive**: Must work on all devices
- **Performance**: Keep bundle size reasonable (<1MB)

#### Best Practices for Demo Development

##### 1. Story-Driven Design
- Focus on user journey, not feature lists
- Create narrative flow through the demo
- Show business impact, not just functionality

##### 2. Interactivity Patterns
- **Progressive Disclosure**: Start simple, reveal complexity
- **Guided Exploration**: Clear CTAs and next steps
- **Reset Capability**: Allow users to restart demos
- **Loading States**: Show progress for async operations

##### 3. Visual Polish
- Match the sophistication of the actual project
- Use smooth animations (Framer Motion recommended)
- Consistent with portfolio design language
- High-quality mockups and assets

##### 4. Technical Considerations
```javascript
// Good: Component-based architecture
const Demo = () => {
  const [activeFeature, setActiveFeature] = useState('overview');
  
  return (
    <div className="demo-container">
      <Navigation onFeatureChange={setActiveFeature} />
      <FeatureDisplay feature={activeFeature} />
    </div>
  );
};

// Good: Responsive design
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

// Good: Performance optimization
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

##### 5. Common Demo Features
- **Multi-step Workflows**: Show complex processes simply
- **Before/After Comparisons**: Highlight transformations
- **Interactive Playgrounds**: Let users experiment
- **Data Visualizations**: Charts, graphs, metrics
- **Persona Switching**: Show different user experiences

#### Example Demo Patterns

##### Pattern 1: Multi-Step Form (Fauxdal)
```javascript
const steps = ['Welcome', 'Input', 'Review', 'Complete'];
const [currentStep, setCurrentStep] = useState(0);

// Progressive form with validation
// Visual progress indicator
// Smooth transitions between steps
```

##### Pattern 2: Before/After Comparison
```javascript
const [showBefore, setShowBefore] = useState(true);

// Split screen or toggle view
// Animated transitions
// Clear visual differences
```

##### Pattern 3: Feature Showcase
```javascript
const features = [
  { id: 'feature1', title: 'Feature 1', component: <Feature1 /> },
  { id: 'feature2', title: 'Feature 2', component: <Feature2 /> }
];

// Tab navigation
// Lazy loading of features
// Contextual help/tooltips
```

#### Troubleshooting Demos

##### Asset Loading Issues
- Ensure `base: './'` in vite.config.js
- Check console for 404 errors
- Verify build output structure

##### Performance Problems
- Use React DevTools Profiler
- Implement code splitting
- Optimize images and assets

##### Cross-Browser Issues
- Test in Chrome, Firefox, Safari
- Check mobile browsers
- Verify touch interactions

### Notebook Customization
Portfolio projects can have customized notebook covers:

```yaml
notebook_color: nordic-blue
notebook_texture: worn
notebook_brand: leuchtturm
notebook_effect: metallic
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-3deg"
```

Options:
- **Colors**: 16 preset colors + gradients
- **Textures**: pristine, worn, scratched, weathered, stained
- **Brands**: Leuchtturm1917, Moleskine, Field Notes, Rhodia, custom
- **Effects**: holographic, metallic
- **Stickers**: Up to 2 custom stickers

### Carousel & Spotlight
- **Mixed Media**: Images and videos in same carousel
- **Spotlight Modal**: Full-screen viewing on click
- **Navigation**: Buttons, indicators, keyboard (arrows/escape), swipe
- **Auto-play**: Videos play with controls in spotlight

## Styling Guidelines

### SCSS Architecture
```
themes/san-diego/source/styles/
├── _variables.scss           # Global variables
├── _device-breakpoints.scss  # Responsive breakpoints
├── _components.scss          # Component imports
├── _blog.scss               # Blog-specific styles
├── _project.scss            # Project-specific styles
├── theme-modes/             # Dark/light mode styles
└── styles.scss              # Main entry point
```

### Theme System
- Uses CSS custom properties for theming
- `prefers-color-scheme` media queries for automatic switching
- No JavaScript-based theme switching (CSS-only)

### Dark Mode Considerations
- Variables like `$card-bg-dark` may need explicit RGB values
- Media query ordering matters for cascade
- Test all changes in both light and dark modes
- Use `rgb(9, 9, 9)` for true black backgrounds

### Mobile-First Approach
- Default styles target mobile
- Desktop styles override via media queries
- Mobile padding often differs (12px vs 36px desktop)
- Touch targets need adequate size

### Style Boundaries
- Component styles stay in their designated files
- No styling in scroll-fix files
- Use data attributes for variations, not JavaScript classes
- Avoid excessive `!important` usage

## Testing & Quality

### Testing Protocols
Consult `TESTING-PROTOCOLS.md` for:
- Change classification (🟢 Green / 🟡 Yellow / 🔴 Red light)
- Required testing based on change type
- Design review requirements
- Visual regression testing

### Visual Development Workflow
1. **ALWAYS** take screenshots before changes (Cmd+Ctrl+Shift+4)
2. Use visual-testing protocols in docs
3. Compare screenshots iteratively
4. Test in both themes and multiple viewports

### Performance Monitoring
- Run `npm run analyze` after significant changes
- Monitor bundle sizes
- Verify lazy loading functionality
- Check Lighthouse scores

### Browser Testing
- Test in Chrome, Firefox, Safari (Mac)
- Check mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
- Verify responsive breakpoints
- Test with/without JavaScript
- **CSS Feature Testing**: Always test advanced CSS features (backdrop-filter, CSS Grid, flexbox gaps, etc.) across browsers
- **Fallback Testing**: Verify that CSS `@supports` queries and fallbacks work properly
- **Visual Regression**: Compare screenshots across browsers for visual consistency
- **Performance**: Test loading speeds and interactions on different browsers
- **Developer Tools**: Check console for browser-specific errors or warnings

## Deployment

### GitHub Actions Pipeline
Automated deployment via `.github/workflows/optimize-and-deploy.yml`:
1. Triggers on push to main
2. Runs image optimization
3. Builds production site
4. Deploys to GitHub Pages (thomas.design)

### Pre-deployment Checklist
- [ ] Run `npm run build:prod` locally
- [ ] Check for build errors/warnings
- [ ] Test all interactive features
- [ ] Verify responsive design
- [ ] Check console for errors
- [ ] Review git diff for unintended changes

### Environment Configuration
Two `.env.example` files show required configs:
- **Root**: API keys, admin config, analytics
- **Blog editor**: GitHub OAuth, session secrets

## Troubleshooting

### Common Issues

#### Port 4000 Already in Use
```bash
# Find and kill process
lsof -i :4000
kill -9 $(lsof -t -i:4000)
```

#### Build Failures
1. Check Node version compatibility
2. Clear Hexo cache: `hexo clean`
3. Delete node_modules and reinstall
4. Check for syntax errors in posts

#### Orphaned Processes
- Multiple Hexo servers running
- Build commands that didn't complete
- File watchers persisting
- Browser-sync instances

#### Style Issues
- Check theme variable inheritance
- Verify media query order
- Test in both light/dark modes
- Clear browser cache

## Best Practices

### Git Workflow
- Create descriptive commit messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Create PRs for significant changes
- Reference issues in commits

### Code Organization
- Follow existing patterns and conventions
- Check if libraries are already in use before adding
- Maintain consistent code style
- Document complex logic

### Performance First
- Optimize images before committing
- Monitor bundle sizes
- Implement lazy loading
- Use performance budgets

### Content Guidelines
- Only create documentation when explicitly requested
- Avoid using emojis unless asked
- Keep responses concise and focused
- Don't add unnecessary comments to code

### Style Implementation Guidelines
**CRITICAL**: When implementing style changes, especially hover effects:
- Read the user's requirements CAREFULLY and implement EXACTLY what they ask for
- "Subtle" means subtle (e.g., #FFF to #F1F1F1, not rgba(0,0,0,0.05))
- When asked to remove ALL transform/movement effects, check ALL instances and variations
- Don't assume - if user says "remove transform", remove ALL transform properties
- Test changes thoroughly before claiming they're complete
- If you fail to implement correctly the first time, expect harsh but deserved criticism

## Technical Debt Registry

### High Priority
1. **HTML Size Limitation**
   - Issue: Large index.html with many `short: true` posts
   - Current fix: Strip scripts/styles from inline content
   - Proper solution: Implement pagination

2. **Deprecated Sass API**
   - Issue: "legacy-js-api" warnings
   - Impact: Will break with Dart Sass 2.0
   - Solution: Update build configuration

### Medium Priority
3. **Duplicate Scroll Implementations**
   - Files: `scroll.js`, `blog.js`, `anchor-links-simple.js`
   - Solution: Consolidate into single utility

4. **Event Handler Conflicts**
   - Multiple scripts attach to same elements
   - Solution: Central event delegation system

### Low Priority
5. **Script Loading Dependencies**
   - Some scripts require specific load order
   - Solution: Implement module system

6. **Missing Error Handling**
   - Silent failures in some components
   - Solution: Add comprehensive error handling

---

*For temporal changes and session history, see CHANGELOG.md*