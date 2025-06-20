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
  - `case-study.md` - Detailed case studies
  - `page.md` - Static pages

### Theme System
The custom "san-diego" theme (`themes/san-diego/`) consists of:
- **Templates**: EJS files in `layout/` for page structures
- **Styles**: SCSS in `source/styles/` with modular architecture
- **JavaScript**: Modular JS in `source/js/` for interactions
- **Scripts**: Build-time scripts in `scripts/` for processing

### Build Pipeline
1. **Hexo Generation**: Converts Markdown to HTML
2. **Asset Processing**: Custom minification script (`scripts/minify-assets.js`)
3. **Image Optimization**: Sharp.js processes images (`tools/optimize-images.js`)
4. **Deployment**: GitHub Actions workflow to GitHub Pages

### Key Features Implementation
1. **Project Gallery**: Uses `project_gallery.ejs` with multiple layout modes
2. **Adaptive Videos**: Automatic video format conversion for web compatibility
3. **Image Optimization**: Sharp.js processes images on build
4. **Dark/Light Mode**: CSS custom properties with JavaScript toggle
5. **Performance**: Lazy loading, minification, and caching strategies
6. **Remote Editor**: Secure blog editor in `tools/blog-editor/` with GitHub OAuth

### Deployment Pipeline
GitHub Actions workflow (`.github/workflows/optimize-and-deploy.yml`):
1. Triggers on push to main
2. Runs image optimization
3. Builds production site
4. Deploys to GitHub Pages with custom domain (thomas.design)

## Testing & Quality Assurance

Before making changes, consult `TESTING-PROTOCOLS.md` for:
- Change classification system (🟢 Green / 🟡 Yellow / 🔴 Red light)
- Required testing procedures based on change type
- Design review requirements for visual changes
- Screenshot and visual regression testing protocols

**Key principle**: Like a professional kitchen, all visual changes above a certain threshold need chef review before going out.

### 🚨 CRITICAL DEPLOYMENT RULE 🚨
**ALWAYS run `npm run build` before committing ANY changes**
- If build fails → DO NOT commit or push
- Fix all errors first
- This is a hard blocker - no exceptions
- Test locally before deployment

## Important Patterns

### Creating New Content
```bash
# New blog post
hexo new blog-post "Post Title"

# New portfolio project
hexo new portfolio-post "Project Name"

# New case study
hexo new case-study "Study Title"
```

### Working with Images
- Place images in post folders: `source/_posts/post-name/`
- Use relative paths in Markdown: `![Alt text](./image.jpg)`
- Images are automatically optimized during build
- Small files (<10KB) are skipped from optimization

### Video Guidelines
- Supported formats: MP4, WebM
- Place in post folders alongside images
- Use adaptive video component for responsive playback
- Different aspect ratios for various grid layouts

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
- Build size analysis available via `npm run analyze`

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

## Carousel & Spotlight Feature

### Overview
The carousel component supports both images and videos, with an integrated spotlight modal for full-screen viewing. When users click on any carousel media, it opens in a spotlight modal with navigation controls.

### Key Features
- **Mixed Media Support**: Carousels can contain both images and videos
- **Spotlight Modal**: Click any carousel item to view it full-screen
- **Navigation Controls**: Previous/next buttons and keyboard navigation (arrow keys, escape)
- **Indicator Dots**: Visual indicators showing current position and allowing direct navigation
- **Video Support**: Videos are displayed with controls in spotlight mode
- **Touch Support**: Swipe gestures on mobile devices

### Implementation Details
The carousel system (`themes/san-diego/source/js/carousel.js`) tracks all media items in a `carouselImages` array that includes:
- Images: stored with their src, alt text, and slide index
- Videos: stored with their poster image (if available) or a placeholder

When opening spotlight mode:
1. The current media item is displayed (image or video with controls)
2. Navigation indicators appear if there are multiple items
3. Users can navigate using buttons, indicators, keyboard, or swipe gestures
4. Videos autoplay with controls visible

### Common Issues & Solutions
- **Missing Indicators**: Usually caused by the carousel not detecting all media items. The system now automatically re-scans for media when opening spotlight
- **Mixed Media**: Carousels with both videos and images now correctly count all items for navigation
- **Dynamic Content**: Project galleries loaded via AJAX are handled with delayed initialization

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

## Recent Front-End Improvements & Fixes (June 2025)

### Accessibility Enhancements
- **Skip Navigation Links**: Added skip links at the top of all pages for keyboard navigation
  - Skip to main content
  - Skip to blog posts (index page)
  - Skip to portfolio (index page)
  - Skip to article content (post/project pages)
  - Implementation: `themes/san-diego/layout/_partial/skip-navigation.ejs`

### Security Improvements
- **External Links**: Automatic addition of `rel="noopener noreferrer"` to all external links
  - Prevents window.opener attacks
  - Adds visual indicators for external links
  - Implementation: `themes/san-diego/source/js/external-links.js`
- **Removed Vulnerable Packages**: `hexo-admin` and `hexo-pdf` removed
- **NPM Overrides**: Force secure versions of dependencies

### Performance Optimizations
- **Resource Hints**: Added DNS prefetch and preconnect for external resources
  - CDN resources (jsdelivr, unpkg, cdnjs)
  - Reduces connection latency
  - Preloads critical CSS
- **Print Stylesheet**: Optimized layout for printing
  - Hides non-essential elements
  - Shows URLs for external links
  - Improves readability with proper page breaks
  - Implementation: `themes/san-diego/source/styles/_print.scss`

### SEO & Structured Data
- **Enhanced Schema.org Implementation**:
  - WebSite schema with publisher information
  - Person schema with social links
  - Article schema for posts and projects
  - BreadcrumbList for better navigation understanding
  - CollectionPage for the homepage
  - Uses @graph for proper entity relationships

### Bug Fixes
- **Back Button Sound Effect**: Fixed incorrect slider.mp3 sound playing when using back button
  - Changed `switchTab('portfolio', true)` to `switchTab('portfolio', false)` in blog.js
  - Added proper button press sound effect
  
- **Border Color in Production**: Fixed missing border colors on cards in production builds
  - Root cause: CleanCSS level 2 optimization removing rgba colors in media queries
  - Solution: Modified minification settings to preserve colors
  - Added comprehensive border color rules with !important for production reliability

- **Theme System Cleanup**: Removed conflicting theme implementations
  - Standardized on `prefers-color-scheme` media queries only
  - Removed `data-theme` and `data-color-scheme` attributes
  - Cleaned up duplicate theme mode files

### Component Library Implementation
- **Custom Micro-Component Library**: Built specifically for Hexo
  - Base component class with lifecycle management
  - Design token system extending existing variables
  - Button component as first implementation
  - Mobile buttons migrated to new system
  - See "Component Library System" section below for full details

## Custom Hexo Tag Plugins

The theme includes several custom tag plugins in `themes/san-diego/scripts/`:
- **video**: Multi-format video embedding with fallbacks
- **carousel**: Image/video carousel generation
- **image-caption**: Automatic image captions from alt text
- **process-alerts**: Alert/callout boxes (info, warning, success, danger)
- **wave-text**: Animated text effects
- **emoji-processor**: Enhanced emoji handling

## Testing Features
```bash
# Test skip navigation
# Press Tab key after page loads - skip links should appear

# Test external links
# Check browser console for processed links:
# window.processExternalLinks()

# Test print styles
# Use browser print preview (Cmd+P or Ctrl+P)

# Test structured data
# Use Google's Rich Results Test: https://search.google.com/test/rich-results
# Or Schema.org validator: https://validator.schema.org/

# Test component library
# Visit /components/ for demo page
hexo new page components

# Analyze build size
npm run analyze
```

## Component Library System (Added June 2025)

### Overview
A custom micro-component library has been implemented to provide consistent, reusable UI components across the site. This system is built specifically for Hexo and provides a foundation for migrating away from scattered component implementations.

### Architecture

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

#### Integration
- **Styles**: Imported in `styles.scss` as `@use '../components/index' as component-lib;`
- **Scripts**: Components auto-initialize via `data-component` attribute
- **Templates**: Use EJS includes with relative paths

### Design Tokens
Extended from existing variables with component-specific values:
```scss
// Spacing scale
$spacing-scale: (
  'xs': 0.25rem,  // 4px
  'sm': 0.5rem,   // 8px
  'md': 1rem,     // 16px
  'lg': 1.5rem,   // 24px
  'xl': 2rem,     // 32px
  'xxl': 3rem     // 48px
);

// Component-specific tokens
$component-heights: (
  'sm': 32px,
  'md': 40px,
  'lg': 48px
);
```

### Creating New Components

1. **Create component directory**:
   ```bash
   mkdir -p themes/san-diego/source/components/core/[component-name]
   ```

2. **Add three files**:
   - `[component-name].js` - Extends BaseComponent class
   - `[component-name].scss` - Uses design tokens
   - `[component-name].ejs` - Template with options

3. **Import styles** in `components/index.scss`:
   ```scss
   @use 'core/[component-name]/[component-name]';
   ```

4. **Use in templates**:
   ```ejs
   <%- include('../../source/components/core/[component-name]/[component-name]', {
     // component options
   }) %>
   ```

### Button Component Example

The button component demonstrates the pattern:

```javascript
// Auto-initialization
<button class="btn btn--primary" data-component="button" data-ripple="true">
  Click me
</button>

// EJS include
<%- include('../../source/components/core/button/button', {
  text: 'Click me',
  variant: 'primary',
  size: 'md',
  icon: { name: 'arrow-right', position: 'end' },
  attributes: { onclick: 'handleClick()' }
}) %>
```

Available variants: `default`, `primary`, `secondary`, `ghost`, `soft`
Available sizes: `sm`, `md`, `lg`

### Migration Strategy

1. **Identify components** to migrate (modals, cards, inputs)
2. **Create adapter functions** for backward compatibility
3. **Update templates** gradually to use new components
4. **Remove old implementations** once migrated

### Important Notes

- **Namespace conflict**: Don't use `components` as namespace (already used by `_components.scss`)
- **Auto-initialization**: Components with `data-component` attribute initialize automatically
- **Sound effects**: Integrated with existing sound system via `window.soundEffects`
- **Accessibility**: All components include ARIA attributes and keyboard support
- **Performance**: Uses event delegation and lazy initialization

## Environment Configuration

Two `.env.example` files show expected configurations:
- **Root level**: API keys, admin config, analytics
- **Blog editor** (`tools/blog-editor/.env.example`): GitHub OAuth, session secrets, paths

## Portfolio Organization

The `_config.yml` includes:
- Company ordering for portfolio grouping
- Year ranges for chronological organization
- Allows both company-based and time-based project views

## Working Patterns & Best Practices

### Visual Development Workflow
When working on UI changes:
1. **ALWAYS** take screenshots before making changes (Cmd+Ctrl+Shift+4 on Mac)
2. Use the visual-testing protocols in `docs/02-development/visual-testing-guide.md`
3. Iterate on designs by comparing screenshots
4. For major changes, use `/project:visual-compare [component]` command

### Portfolio Improvement Checklist
When improving portfolio projects, ensure:
- ✓ Clear problem statement and context
- ✓ Research and insights documented  
- ✓ Design process shown (sketches → wireframes → final)
- ✓ Mobile designs included with responsive behavior
- ✓ Metrics and measurable outcomes stated
- ✓ Your specific role clarified vs team contributions
- ✓ Technical implementation details where relevant
- ✓ Lessons learned or reflections

### Performance First Approach
- Run `npm run analyze` after significant changes
- Check that images are optimized before committing
- Verify lazy loading works for new content  
- Monitor bundle sizes with each feature addition
- Use `/project:performance-audit [target]` for detailed analysis

### Git Workflow Best Practices
- Let Claude write detailed commit messages based on changes
- **ALWAYS** run `npm run build` before committing (no exceptions)
- Create PRs for significant changes using `gh pr create`
- Reference issues in commits: `fixes #123` or `relates to #456`
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`

### Quick Commands Reference
Custom commands available via `/project:`:
- `portfolio-improve [project-name]` - Enhance a portfolio case study
- `performance-audit [target]` - Run performance analysis
- `fix-tech-debt [issue]` - Address technical debt items
- `visual-compare [component]` - Create visual regression comparison

### Screenshot Tips
- **Mac screenshot to clipboard**: Cmd+Ctrl+Shift+4
- **Paste into Claude**: Ctrl+V (NOT Cmd+V)
- **Full page screenshot**: Browser DevTools → Cmd+Shift+P → "Capture full size screenshot"
- **Multiple viewport testing**: Use browser responsive mode

### Effective Claude Usage Patterns
1. **Research First**: Ask Claude to explore and understand before coding
2. **Plan Before Implementation**: Request a plan, review it, then execute
3. **Iterate Visually**: Use screenshots for UI work
4. **Clear Context**: Use `/clear` between major task switches
5. **Leverage Subagents**: For complex research or verification tasks