# CHANGELOG.md

## Recent Session Changes & History

### June 2025 Session

#### 1. Shared Demo Component System
- **Created**: Reusable browser chrome wrapper for all portfolio demos
- **Location**: `/demos/shared/` directory with components and documentation
- **Components**:
  - `DemoWrapper`: Complete wrapper with background + browser chrome
  - `BrowserChrome`: Customizable browser window component
  - Shared CSS with multiple themes and patterns
- **Features**:
  - Three browser themes: Mac (default), Windows, Minimal
  - Multiple background patterns: Grid, dots, diagonal, custom
  - Fully responsive with dark mode support
  - Props for customization: URL, theme, background, etc.
- **Benefits**:
  - Consistent look across all demos
  - Single source of truth for demo presentation
  - Easy migration path for existing demos
  - Less code duplication

#### 2. UX Artifacts Component Library
- **Created**: 12 reusable components for documenting UX process in case studies
- **Location**: `/themes/san-diego/source/components/ux-artifacts/`
- **Components Created**:
  - Research Insights - Key findings from user research
  - Process Timeline - Design phases with deliverables
  - Before/After Comparison - Visual transformations
  - Design Principles - Guiding design decisions
  - User Journey Map - User flows with emotions
  - Stakeholder Quotes - Testimonials with context
  - Wireframe Evolution - Design iteration process
  - Component Showcase - Design system displays
  - System Architecture - Technical diagrams
  - Testing Results - Usability testing validation
  - Impact Metrics - Business impact displays
  - Reflection & Learnings - Project retrospectives
- **Styling**: Complete SCSS system (500+ lines) with responsive design
- **Documentation**: Comprehensive README with usage examples
- **Purpose**: Address recruiter feedback about missing UX process documentation

#### 3. Complete 3D Notebook Animation System
- **Major Achievement**: Implemented comprehensive 6-layer notebook animation system
- **Architecture**: 
  - **Layer 6**: Back cover (static anchor, no animation)
  - **Layer 5**: Inside back cover (static anchor)  
  - **Layer 4**: Right inner page (content display)
  - **Layer 3**: Left inner page (content display)
  - **Layer 2**: Inside front cover (animates with front cover)
  - **Layer 1**: Front cover (primary interactive layer)

- **Animation Features**:
  - Z-index swapping during animation for visual continuity
  - Transform origins aligned to spine (0% 50%) for realistic rotation
  - Smooth 1.8s cubic-bezier transitions with staggered timing
  - 150° rotation with 15% right translation on hover

- **Visual Fixes Completed**:
  - **Gap Prevention**: Left inner page positioned at `left: 6px, right: 8px` to close spine gaps
  - **Cover Alignment**: Inside front cover positioned 2px inset from all sides of front cover  
  - **Edge Overflow**: Back cover uses `overflow: hidden` with inset page edge pseudo-elements
  - **Layer Management**: Proper z-index ordering (1-6) with mid-animation swapping

- **Technical Implementation**:
  - 3D transforms with `transform-style: preserve-3d` and `perspective: 2000px`
  - GPU-accelerated animations with `translateZ()` layering
  - EJS template fixes for regex syntax (`\\s+` to `\s+`)
  - Mobile-compatible with existing carousel system

- **Files Modified**:
  - `_leuchtturm-notebook.scss` - Complete 6-layer structure and animations
  - `portfolio-projects.ejs` - Updated HTML structure and EJS syntax fixes
  - `project_gallery.ejs` - Added demo button functionality
  - `head.ejs` - Added new JS components
  - Created `byline-modal.js` and `project-demo.js` components

#### 2. Screen Wipe Transition Direction Change
- **Changed**: Transition animation from top/bottom sliding to left/right sliding
- **Files Modified**: `_screen-wipe-transition.scss`
- **Implementation**: Updated transform properties from `translateY` to `translateX`
- **Panels**: Left panel slides from -100% to 0, right panel from 100% to 0

#### 3. Notebook Carousel Back Button Fix
- **Issue**: Notebooks displayed vertically stacked when returning from project view
- **Root Cause**: Carousel wasn't re-initializing properly on popstate event
- **Solution**:
  - Modified popstate handler to emit `contentLoaded` and `portfolio-loaded` events
  - Added immediate class application for mobile devices
  - CSS-first approach: Made horizontal flex layout default on mobile
  - Removed initialization delays since CSS handles layout from start
- **Files Modified**: 
  - `blog.js` - Enhanced popstate handler
  - `portfolio-notebook-carousel-clean.js` - Improved initialization
  - `_leuchtturm-notebook.scss` - Default mobile flex layout

#### 4. Notebook Customization Framework
- **Purpose**: Allow unique visual identity for each portfolio project
- **Architecture**:
  - Color system with 16 preset colors plus gradients
  - Texture overlays (pristine, worn, scratched, weathered, stained)
  - Brand customization (Leuchtturm, Moleskine, Field Notes, Rhodia, custom)
  - Special effects (holographic, metallic)
  - Sticker system (up to 2 custom stickers)
- **Implementation**:
  - Created `_notebook-customization.scss` with comprehensive SCSS maps
  - Updated `portfolio-projects.ejs` to read customization from front matter
  - Data attribute based styling system
  - CSS custom properties for dynamic values
- **Usage**: Add properties to portfolio post front matter
- **Documentation**: Created comprehensive guide at `docs/notebook-customization-guide.md`

### Recent Front-End Improvements & Fixes

#### Accessibility Enhancements
- **Skip Navigation Links**: Added skip links at the top of all pages for keyboard navigation
  - Skip to main content
  - Skip to blog posts (index page)
  - Skip to portfolio (index page)
  - Skip to article content (post/project pages)
  - Implementation: `themes/san-diego/layout/_partial/skip-navigation.ejs`

#### Security Improvements
- **External Links**: Automatic addition of `rel="noopener noreferrer"` to all external links
  - Prevents window.opener attacks
  - Adds visual indicators for external links
  - Implementation: `themes/san-diego/source/js/external-links.js`
- **Removed Vulnerable Packages**: `hexo-admin` and `hexo-pdf` removed
- **NPM Overrides**: Force secure versions of dependencies

#### Performance Optimizations
- **Resource Hints**: Added DNS prefetch and preconnect for external resources
  - CDN resources (jsdelivr, unpkg, cdnjs)
  - Reduces connection latency
  - Preloads critical CSS
- **Print Stylesheet**: Optimized layout for printing
  - Hides non-essential elements
  - Shows URLs for external links
  - Improves readability with proper page breaks
  - Implementation: `themes/san-diego/source/styles/_print.scss`

#### SEO & Structured Data
- **Enhanced Schema.org Implementation**:
  - WebSite schema with publisher information
  - Person schema with social links
  - Article schema for posts and projects
  - BreadcrumbList for better navigation understanding
  - CollectionPage for the homepage
  - Uses @graph for proper entity relationships

#### Bug Fixes
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

#### Component Library Implementation
- **Custom Micro-Component Library**: Built specifically for Hexo
  - Base component class with lifecycle management
  - Design token system extending existing variables
  - Button component as first implementation
  - Mobile buttons migrated to new system

### UI Component Enhancements (Latest Session)

#### 1. Search Clear Button Implementation
- Added minimal clear button to search input that only shows when field has content
- Position absolutely inside search-input-wrapper
- No borders or box-shadows for clean appearance
- Proper event handling with cleanup of previous listeners
- Initialize on page load and dynamic content loads

#### 2. Button Style Standardization
- Migrated Posts Only and Search buttons to outline style (transparent background)
- Greyscale active states (black/white) instead of colored
- Consistent hover opacity (30%) across all buttons
- Dark mode text color set to hsl(0, 0%, 75%) for proper contrast

#### 3. Content Display Optimization
- Non-interactive portfolio projects rendered as comma-separated text lists
- Saves vertical space allowing more interactive projects to be visible
- Uses `.no-writeup-list` class with transparent background and no borders
- Maintains grid layout compatibility

#### 4. Sound Effect Integration
- Posts Only button: plays small click sound (carousel button sound)
- Search input: plays book sound on click
- Impact/Contact modals: close buttons play appropriate sounds
- Consistent audio feedback across UI interactions

#### 5. Border Radius Standardization
- Updated all instances from 15px to 12px for consistency
- Affects blog-content, portfolio items, and nested components
- Creates more modern, cohesive visual appearance

## Development Insights & Lessons Learned

### CSS Architecture & Dark Mode Complexities
1. **Dark mode inheritance issues**: Variables like `$card-bg-dark` sometimes resolve to light colors (e.g., `hsl(0, 0%, 75%)` instead of expected dark values). Always verify computed values.
2. **Media query ordering matters**: Dark mode styles can be overridden by device-specific styles. Check specificity and cascade order.
3. **Use explicit RGB values**: When dark mode variables fail, use explicit `rgb(9, 9, 9)` for true black backgrounds.
4. **Border handling**: Setting borders to 0 on specific edges (right/bottom) creates unique visual effects and solves overflow issues.

### Mobile vs Desktop Styling Patterns
1. **Responsive padding differences**: Mobile often has different padding (12px vs 36px), affecting absolute positioning of child elements.
2. **Position context changes**: `.profile-header` padding varies between mobile/desktop, requiring careful absolute positioning calculations.
3. **!important flag usage**: Sometimes necessary for mobile-specific overrides, but use sparingly and document why.

### Sound System Integration
1. **Centralized sound management**: The site has a sophisticated sound system in `sound-effects.js` with preloading and helper functions.
2. **Audio format considerations**: Use .m4a for sound effects (not .mp3) for consistency and better compression.
3. **Event timing**: Play sounds at the beginning of event handlers for immediate feedback.
4. **Sound categories**: Different sounds for different actions (toggle, small click, button press).
5. **Helper function pattern**: Create dedicated functions like `playBookSound()` for new sounds.

### Portfolio Display Optimization
1. **Space-saving techniques**: Render non-interactive projects as comma-separated text lists instead of grid items.
2. **Content hierarchy**: Use "Other projects include:" prefix to clearly differentiate project types.
3. **Grid layout flexibility**: `grid-column: 1 / -1` spans full width, useful for special content blocks.
4. **Height constraints**: Match grid row heights (120px) even for text-only content.

### Button Design Evolution
1. **Outline style trend**: Moving from filled buttons to outline styles creates cleaner, more modern interfaces.
2. **Consistent hover states**: Greyscale hovers (30% opacity borders) work better than colored states for neutral UI.
3. **Active state contrast**: Black/white fills provide clear feedback without color dependency.
4. **Font consistency**: Matching font-size (12px) and weight (500) across related elements improves cohesion.
5. **Placeholder refinement**: 60% opacity provides optimal readability without being too prominent.

### Development Workflow Improvements
1. **Console.log cleanup**: Always remove debug statements before production. Use comments instead.
2. **Build verification**: Run `npm run build` after every significant change to catch issues early.
3. **SCSS linting**: Warnings about modern CSS notation aren't breaking but indicate future compatibility needs.
4. **Git diff review**: Always review changes before committing to catch unintended modifications.
5. **Comprehensive search**: When removing debug code, search all modified files systematically.

### Cross-Theme Compatibility
1. **Light/dark mode testing**: Every change needs verification in both themes - they often behave differently.
2. **Compromise solutions**: Sometimes perfect alignment in both themes isn't possible; find acceptable middle ground.
3. **Theme-specific overrides**: Occasionally necessary but try to minimize for maintainability.
4. **Explicit color values**: When theme variables produce unexpected results, use explicit RGB/HSL values.

### Performance Considerations
1. **Lazy loading preservation**: Ensure dynamic content changes don't break lazy loading functionality.
2. **Event delegation**: Better than individual listeners for dynamically loaded content.
3. **Build size monitoring**: Check that new features don't significantly increase bundle size.
4. **Sound preloading**: Preload audio files to ensure immediate playback on user interaction.

### User Experience Refinements
1. **Text overflow handling**: Multiple properties needed (`white-space`, `overflow`, `text-overflow`) to prevent button text cutoff.
2. **Touch targets**: Mobile buttons need adequate padding for comfortable tapping.
3. **Visual feedback**: Immediate sound feedback improves perceived responsiveness.
4. **Placeholder styling**: Consistent opacity across light/dark modes maintains visual hierarchy.
5. **Border radius consistency**: Updating from 15px to 12px across all components creates cohesion.

### Technical Debt Management
1. **Document known issues**: Add TODO comments for future fixes (like mobile button positioning).
2. **Incremental improvements**: Not everything needs perfect fixes immediately - functional is better than broken.
3. **Pattern recognition**: Similar issues (like console.logs) often appear in multiple files - search comprehensively.
4. **Testing strategy**: Manual testing still crucial for visual changes and interaction patterns.
5. **Priority assessment**: Low-priority issues (like positioning compromises) can be noted for future improvement.

### Problem-Solving Strategies
1. **User feedback integration**: "Don't be lazy" - be thorough with selectors and specificity.
2. **Iterative refinement**: Multiple attempts may be needed to get mobile styles right.
3. **Root cause analysis**: Variable inheritance issues require tracing through SCSS compilation.
4. **Pattern application**: Apply working patterns (like portfolio display) to similar problems.
5. **Clear communication**: Document what was changed and why for future reference.

### Debugging UI Layout Issues (Contact Modal Fix)
When elements aren't displaying properly:
1. **Look at screenshots carefully** - Visual issues often reveal the exact problem (height constraints, overflow, etc.)
2. **Check parent containers first** - Look for max-height, overflow:hidden, or fixed dimensions
3. **Think like DevTools** - What would you inspect first? Usually container constraints, not child layouts
4. **Start simple** - Remove constraints (max-height: unset) and center items (justify-items: center) before complex grid properties
5. **Trust user hints** - When user says "there is clearly a max-height", that's the immediate focus
6. **Don't overcomplicate** - A 2x2 grid that won't display is usually a container issue, not a grid layout issue

### Effective Working Pattern (June 2025)
The user has noted that our recent working approach has been particularly effective:
1. **Focused, specific changes**: Making targeted fixes without scope creep
2. **Clear communication**: Explaining what's being changed and why
3. **Build verification**: Always running `npm run build` after changes
4. **Systematic approach**: Finding the root cause before implementing fixes
5. **Mobile-first considerations**: Being thorough with mobile-specific styling needs
6. **Edge-to-edge implementations**: Understanding padding redistribution patterns (moving from parent to child)
7. **Clarification before action**: When finding unexpected implementations (e.g., transition already from top/bottom when user expected left/right), ask for clarification and thank the user for clarifying when they explain what they actually want

This collaborative pattern of clear requests, focused implementation, and immediate verification has proven highly productive.

### CSS-First Solutions for JavaScript Problems
1. **Principle**: Many visual glitches can be prevented with CSS defaults rather than fixed with JavaScript
2. **Example**: Notebook carousel vertical stacking issue
   - Initial approach: Detect and fix stacking with JavaScript (reactive)
   - Better approach: Apply flex layout by default in CSS (preventive)
3. **Benefits**:
   - No flash of incorrect layout
   - Works immediately on page load
   - More performant (no layout thrashing)
   - Simpler code maintenance

### State Management in Dynamic Content
1. **Problem**: Complex state when navigating between views (especially with back button)
2. **Solution Pattern**:
   - Use events to communicate state changes
   - Apply critical styles immediately before JavaScript initializes
   - Clean up previous instances before creating new ones
3. **Implementation**: Global instance tracking with proper cleanup in destroy methods

### Data Attribute Architecture
1. **Pattern**: Use data attributes for styling variations instead of JavaScript class manipulation
2. **Benefits**:
   - Declarative styling in HTML/templates
   - CSS handles all visual changes
   - Easy to debug in DevTools
   - Works with server-side rendering
3. **Example**: Notebook customization framework uses data-notebook-* attributes

### Mobile-First Default Layouts
1. **Insight**: Default mobile layouts should match final JavaScript state
2. **Implementation**: 
   - Apply mobile layout rules by default in CSS
   - JavaScript only adds interactive behavior
   - Prevents layout shift on initialization
3. **Trade-off**: Desktop might need to override mobile defaults, but mobile experience is prioritized

### Critical Styling Rules - Historical Context
These rules were established after several sessions where changes exceeded scope:

#### Respecting Boundaries and Constraints
**THE MOST IMPORTANT RULE**: When given a specific task with constraints, DO NOT make changes outside those boundaries.

##### Example of Boundary Violations to Avoid:
- User says "Projects are working fine" → DO NOT modify project code
- User asks to fix scroll issues → DO NOT change button colors
- User creates a file for scroll fixes → DO NOT add styling to it
- User says "look at what works and apply that pattern" → DO NOT change the working code

#### File Purpose Boundaries
Each SCSS file has a specific purpose. NEVER cross these boundaries:
- `_dynamic-content-scroll-fix.scss`: ONLY for fixing scroll behavior, NO styling
- `_blog.scss`: Component styling for blog elements
- `_project.scss`: Component styling for project elements
- `_mobile-scroll-fix.scss`: Mobile-specific scroll fixes only

#### Dynamic Back Button Styling
- **Location**: ONLY in `_blog.scss` (lines 802-859)
- **Background**: ALWAYS black in ALL modes (light/dark)
- **NEVER** add dynamic-back-button styling to any other file
- If you see white background rules for dynamic-back-button anywhere else, DELETE THEM

#### Blog Content Dark Mode
- `.blog .blog-content` MUST have `background-color: rgb(9, 9, 9)` in dark mode
- This is defined in `_blog.scss` and `_dynamic-content-scroll-fix.scss`

#### Project Edge Wrapper
- Must have `border-radius: 15px 0 0 0` (top-left only)
- Defined in `_project.scss`

#### Dynamic Content Scroll Patterns
- **Projects work correctly**: They insert WITHOUT `.content-inner-wrapper`
- **Posts had issues**: They were wrapped in `.content-inner-wrapper` with overflow:hidden
- **Fix approach**: Use CSS to handle scroll, NOT JavaScript DOM manipulation
- **Understanding before action**: Study working patterns before implementing fixes

#### Problem-Solving Approach
1. **Listen to explicit constraints**: If told not to touch something, DON'T
2. **Understand what works first**: Analyze working examples without modifying them
3. **Apply patterns, don't change originals**: Use working patterns to fix broken things
4. **Stay within scope**: Fix only what was asked, nothing more
5. **Use appropriate specificity**: Target precisely without !important spam
6. **Respect file organization**: Keep code in its designated location

#### Red Flags That You're Going Off Track
- Adding styling to files meant for layout/behavior fixes
- Modifying code the user said was working correctly
- Using !important more than once or twice
- Making changes unrelated to the stated problem
- Ignoring explicit user corrections
- Assuming you know better than the user's constraints

#### When User Says Something Works
- **DO**: Study it to understand the pattern
- **DO**: Apply that pattern to fix other things
- **DON'T**: Modify it
- **DON'T**: "Improve" it
- **DON'T**: Touch it at all

#### Recovery When You've Gone Off Track
1. **Stop immediately** when corrected
2. **Revert changes** without argument
3. **Focus only** on the original request
4. **Ask for clarification** if constraints are unclear
5. **Never defend** unnecessary changes