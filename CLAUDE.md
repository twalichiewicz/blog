# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Quick Start:** Run `npm run onboard` for an interactive orientation to this codebase.

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

## 🚨 STOP! READ THIS FIRST 🚨

**🔒 MAIN BRANCH IS PROTECTED - DO NOT COMMIT TO MAIN 🔒**

### 🤖 MANDATORY FIRST COMMAND FOR ALL CLAUDE SESSIONS:
```bash
npm run check-branch
```
**DO NOT SKIP THIS STEP - RUN IT IMMEDIATELY WHEN STARTING**

Before making ANY changes, you MUST:
1. Run `npm run check-branch` (MANDATORY)
2. Check current branch: `git branch --show-current`
3. If on main: IMMEDIATELY create worktree or feature branch
4. NEVER use `git commit` while on main branch

## 🚀 Quick Reference Card

### ⚠️ CRITICAL: Check Branch Before Any Work
```bash
# ALWAYS check which branch you're on FIRST
git branch --show-current

# If you're on 'main', STOP and create a worktree:
git worktree add -b feature/name ../blog-feature
# Then navigate to the worktree directory to work
```

### Most Common Workflows
```bash
# Fix something quickly - CREATE BRANCH FIRST
git checkout -b fix/issue-name  # ← NEVER skip this step
npm run dev
# Make changes, test locally
npm run build  # MUST PASS before committing
git add -A && git commit -m "fix: description"
git push -u origin fix/issue-name
open "https://github.com/twalichiewicz/blog/pull/new/fix/issue-name"

# Add new feature with worktree (PREFERRED)
git worktree add -b feature/name ../blog-feature
# Copy files between directories as needed
cp source/file.js ../blog-feature/source/file.js

# Common commands
npm run dev          # Development with self-healing
npm run build        # Build everything (REQUIRED before commit)
npm run doctor       # Check system health
npm run fix          # Auto-fix issues
```

### Key Rules
- 🛑 **NEVER EVER** commit to main directly
- ✅ ALWAYS check branch with `git branch --show-current` before starting
- ✅ ALWAYS create feature branches or worktrees
- ✅ ALWAYS run `npm run build` before committing
- ✅ ALWAYS test on Netlify preview before merging
- 📝 Create `*-plan.md` for complex features

### Decision Tree: What Workflow Should I Use?

**Simple fix (typo, color change, small CSS tweak)?**
→ Create branch directly: `git checkout -b fix/issue-name`

**Complex feature or multiple file changes?**
→ Use worktree: `git worktree add -b feature/name ../blog-feature`

**Need to test across multiple scenarios?**
→ Create PR early, use Netlify preview for testing

**Experimental changes that might break things?**
→ Definitely use worktree to isolate changes

**Working on demos or interactive components?**
→ Use worktree + `npm run dev:demos` in parallel

## 🚨 Critical Rules & Warnings

### Development Workflow Requirements
**MANDATORY: Use Feature Branches and PR-Based Workflow**
- NEVER push directly to main branch - ALL changes must go through PRs
- ALWAYS create feature branches for any changes
- ALWAYS use git worktrees for complex features or fixes
- ALWAYS create a detailed plan BEFORE writing any code
- Create implementation plans in `*-plan.md` files for major changes
- Get user approval on plans before proceeding
- Every PR gets a Netlify preview for testing
- This prevents issues like the redirect bug that affected production

**⚠️ CRITICAL WORKFLOW VIOLATION WARNING ⚠️**
**DO NOT MAKE ANY CODE CHANGES ON MAIN BRANCH - EVER**
- If you make changes on main branch, you have VIOLATED the workflow
- Create worktree FIRST, then make changes in the worktree
- Making changes on main then trying to move them to worktree contaminates the process
- If you violate this, STOP immediately and ask for guidance
- Document the violation and restart from clean state

### Git Worktree Workflow
**CORRECT WORKFLOW - FOLLOW EXACTLY:**
```bash
# Step 1: Create worktree BEFORE touching any code
git worktree add -b feature/new-feature ../blog-new-feature

# Step 2: Work ONLY in the worktree directory
# DO NOT make changes in main working directory

# Step 3: List worktrees to verify
git worktree list

# Step 4: When done, remove worktree
git worktree remove ../blog-new-feature
```

**WRONG WORKFLOW - NEVER DO THIS:**
```bash
# ❌ Making changes on main branch first
# ❌ Then trying to move them to worktree
# ❌ This contaminates the process and violates workflow
```

#### Claude Code Worktree Limitations
**IMPORTANT**: Claude Code has security restrictions on directory access:
- Cannot `cd` to parent directories or sibling directories
- Cannot directly edit files in worktrees created outside the main directory
- Workaround strategies:
  1. Create branch directly in main repo: `git checkout -b feature/name`
  2. Copy files between directories: `cp file.txt ../worktree/file.txt`
  3. Use `git stash` to transfer changes between branches
  4. Request user to manually navigate to worktree directories if needed

### PR-Based Development Workflow
**IMPORTANT**: Never push directly to main branch. All changes must go through pull requests.

#### Creating Changes
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

2. **Make your changes**
   - Follow all existing guidelines
   - Run `npm run dev` to test locally
   - Ensure `npm run build` succeeds

3. **Push to create PR**
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create PR programmatically (if GitHub CLI is available)**
   ```bash
   # Method 1: Using gh CLI (requires authentication)
   gh pr create --title "Title" --body "Description"
   
   # Method 2: Open browser to create PR
   open "https://github.com/twalichiewicz/blog/pull/new/feature/your-feature-name"
   
   # Note: GitHub CLI authentication in Claude Code
   # - Environment variable GITHUB_TOKEN is not always available
   # - Alternative: GH_TOKEN=$GITHUB_TOKEN gh pr create ...
   # - If auth fails, use browser method instead
   ```

5. **Verify PR Checks**
   - Wait for Netlify preview deployment
   - Check the preview URL (commented on PR)
   - Ensure all GitHub Actions checks pass
   - Review any safety warnings

#### PR Preview System
- **Netlify Preview**: Every PR gets a unique preview URL (format: `https://deploy-preview-[PR-NUMBER]--thomasdesign.netlify.app/`)
- **Safety Checks**: Pre-deploy script runs automatically
- **Build Validation**: GitHub Actions verify the build
- **No Production Impact**: Changes are isolated until merged

#### Staging Server Workflow
1. **Create PR**: Push feature branch and create pull request
2. **Wait for deployment**: Netlify bot comments with preview URL (~2-3 minutes)
3. **Test on staging**: 
   - Preview URL format: `https://deploy-preview-[PR-NUMBER]--thomasdesign.netlify.app/`
   - Test in both light/dark modes
   - Check mobile responsiveness
   - Verify interactive features
4. **Iterate if needed**: Push more commits to update preview
5. **Merge when ready**: Production deployment happens automatically

#### Important Notes
- The pre-deploy check uses `--force` flag temporarily due to history manipulation issues
- Preview deployments go to the "preview" environment
- Production deployments only happen after merging to main
- Cache-busting headers prevent stale content issues
- Claude Code cannot access parent directories, so worktree operations may require manual steps
- Each commit to a PR branch triggers a new preview build

### Plan-First Development Process
1. **Planning Phase** (REQUIRED)
   - Create `feature-name-plan.md` with:
     - Problem statement
     - Proposed solution
     - Files to be modified
     - Potential risks
     - Testing strategy
   - Get user approval before proceeding

2. **Implementation Phase**
   - Work in git worktree
   - Follow the approved plan exactly
   - Test thoroughly before merging

3. **Verification Phase**
   - Run all tests
   - Build and verify locally
   - Check for unintended side effects

### Build Requirements
**ALWAYS run `npm run build` before committing ANY changes**
- If build fails → DO NOT commit or push
- Fix all errors first
- This is a hard blocker - no exceptions
- Test locally before deployment
- **NEW**: Build now includes SCSS validation (`npm run test:scss`) to prevent undefined variable errors

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
- NEVER push directly to the main branch - always use PRs
- Always follow security best practices

### Common Pitfalls to Avoid
1. **Forgetting to build before committing** - Always run `npm run build`
2. **Working in the wrong branch** - Check with `git branch` before starting
3. **Modifying production directly** - Always use feature branches
4. **Ignoring TypeScript/build errors** - Fix ALL errors before pushing
5. **Not testing in both light/dark modes** - Both must work correctly
6. **Assuming libraries exist** - Check package.json first
7. **Creating unnecessary files** - Edit existing files when possible
8. **Adding comments without being asked** - Keep code clean
9. **Making changes beyond the scope** - Stick to what was requested
10. **Pushing changes with undefined SCSS variables** - The build now validates SCSS to prevent this

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

# Start development server with self-healing
npm run dev

# Build for production
npm run build:prod
```

### Common Commands Reference
```bash
# Development
npm run dev            # Start dev with self-healing, auto-rebuild, and monitoring
npm run server         # Start local server only (legacy, no self-healing)
npm run build          # Build everything (demos + site)
npm run build:prod     # Production build with optimizations
npm run test           # Run comprehensive test suite

# Health & Maintenance (NEW!)
npm run doctor         # Check system health
npm run fix            # Auto-fix detected issues
npm run health         # Interactive health dashboard

# Deployment
npm run deploy         # Deploy to GitHub Pages

# Code Quality
npm run test:scss      # Validate SCSS compilation (catches undefined variables)
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
8. **Self-Healing System**: Automatic issue detection and fixing during development

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

### Custom Cursor System
Portfolio demos use a unified custom cursor system for enhanced user experience:

#### Cursor Architecture
- **Central CSS File**: `/demos/shared/styles/demo-cursors.css` contains all cursor definitions
- **Base64 SVGs**: Cursors are encoded to avoid Hexo's JSON wrapping of SVG files  
- **CSS Variables**: Defined as custom properties for easy customization
- **Auto-Application**: Import the CSS and cursors apply automatically

#### Adding Cursors to Demos
```css
/* In your demo's main CSS */
@import '@portfolio/demo-shared/styles/demo-cursors.css';
```

#### Available Cursors
- `--cursor-default`: White arrow (general navigation)
- `--cursor-pointer`: Arrow with blue dot (interactive elements)
- `--cursor-active`: Arrow with larger dot (pressed state)
- `--cursor-text`: I-beam for text input
- `--cursor-disabled`: Prohibition sign
- `--cursor-loading`: Circular spinner
- `--cursor-grab/grabbing`: Drag handles

For complete documentation, see `/docs/PROTOTYPE-CURSORS.md`.

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

### Quick Testing Checklist
```bash
# Before pushing any changes:
npm run build              # Must pass - no exceptions
npm run lint:scss          # Check SCSS formatting
npm run test               # Run test suite
npm run analyze            # Check bundle size

# Manual testing:
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Check browser console for errors
- [ ] Verify interactive features work
```

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

### Testing on Staging
1. Push to feature branch
2. Wait for Netlify comment with preview URL
3. Test comprehensively:
   - All affected pages
   - Both color modes
   - Mobile/tablet/desktop
   - Interactive features
   - Performance metrics

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
1. Run `npm run doctor` to diagnose issues
2. Run `npm run fix` to apply automatic fixes
3. If issues persist:
   - Check Node version compatibility
   - Clear Hexo cache: `hexo clean`
   - Delete node_modules and reinstall
   - Check for syntax errors in posts

#### Changes Not Showing on localhost:4000
This is automatically handled by the self-healing system in `npm run dev`. For manual fixes:
1. Use `npm run dev` instead of `npm run server` - it builds demos first
2. For existing servers showing old content:
   ```bash
   # Stop server (Ctrl+C)
   npm run clean
   npm run dev
   ```
3. If still seeing old content, force browser refresh (Cmd+Shift+R)

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
- Run `npm run test:scss` to catch SCSS compilation errors (undefined variables, etc.)
- Check if variables are properly imported with @use before being referenced

### Emergency Procedures

#### If You Break Production
1. **Don't panic** - The site has backups
2. **Revert immediately**:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Notify user** about the issue
4. **Fix in feature branch** and test thoroughly

#### If Build Keeps Failing
1. Run `npm run doctor` for diagnostics
2. Try `npm run fix` for auto-fixes
3. Clear all caches:
   ```bash
   hexo clean
   rm -rf node_modules
   npm install
   ```
4. Check Node.js version compatibility

#### If PR Preview Isn't Working
1. Check Netlify dashboard for build logs
2. Ensure branch is pushed correctly
3. Wait 3-5 minutes for deployment
4. Check for build errors in PR checks

## Self-Healing Development System

### Overview
The portfolio includes a comprehensive self-healing system that automatically detects and fixes common development issues. This reduces friction and improves developer experience by handling routine problems automatically.

### Key Features
- **Automatic Issue Detection**: Monitors for Hexo warehouse errors, port conflicts, memory issues, and more
- **Smart Auto-Fix**: Safely fixes issues like database corruption, blocked ports, and missing builds
- **Real-Time Monitoring**: Watches for errors during development and fixes them automatically
- **Health Dashboard**: Interactive terminal UI for system monitoring and control

### Quick Commands
```bash
# Start development with self-healing (RECOMMENDED)
npm run dev

# Check system health
npm run doctor

# Apply automatic fixes
npm run fix

# Open health dashboard (requires blessed packages)
npm run health
```

### What Gets Fixed Automatically
1. **Hexo Warehouse Errors**: Cleans database and restarts server
2. **Port Conflicts**: Kills processes blocking port 4000
3. **Memory Issues**: Triggers garbage collection
4. **Missing Demo Builds**: Rebuilds demos automatically
5. **Cache Problems**: Clears stale or corrupted caches
6. **Dark Mode CSS**: Updates visibility issues

### Health Dashboard Features
- System status overview
- Real-time memory graphs
- Build performance metrics
- Active issues list
- Server monitoring
- Quick action shortcuts (c=clean, b=build, f=fix, r=restart)

### Advanced Usage
```bash
# Continuous monitoring mode
node build-system/self-healing-cli.js monitor

# Generate health report
node build-system/self-healing-cli.js report
```

### Full Documentation
See [Self-Healing System Guide](./docs/guides/development/self-healing-system.md) for detailed information.

## Claude Auto-Fix System

### Overview
This codebase includes an AI-powered auto-fix system that can automatically resolve test failures and validation errors using Claude AI.

### Quick Usage
```bash
# Set up API key
export CLAUDE_API_KEY="sk-ant-..."

# Auto-fix demo validation errors
npm run fix:demos

# Run all tests with auto-fix
npm run test:autofix

# Preview fixes without applying
DRY_RUN=true npm run fix:demos
```

### What It Can Fix
- Missing DemoWrapper components
- Missing or incorrect imports
- Prop validation errors
- Build configuration issues
- Missing dependencies
- Onboarding integration

### Important Notes
- **Always review changes** before committing
- **Use feature branches** for auto-fixes
- **Set API key** as environment variable only
- **Monitor costs** - uses Claude API tokens

### CI/CD Integration
The system includes GitHub Actions workflow:
1. Add `ANTHROPIC_API_KEY` to repository secrets
2. Push changes to feature branch
3. Auto-fix workflow creates PR with fixes

### Full Documentation
See [Claude Auto-Fix System Documentation](./docs/CLAUDE-AUTOFIX-SYSTEM.md) for complete guide including:
- Detailed setup instructions
- Configuration options
- Troubleshooting guide
- API reference
- Cost management

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