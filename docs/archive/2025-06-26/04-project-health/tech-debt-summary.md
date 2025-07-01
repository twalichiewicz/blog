# Technical Debt Tracker

This document tracks known technical debt, architectural issues, and planned improvements for the thomas.design blog codebase. Last comprehensive review: June 2025.

## Priority 1 - Critical Issues

### HTML Generation Size Limit
- **Issue**: Posts with `short: true` are rendered inline, causing massive HTML files
- **Current Impact**: 162 short posts generate ~3MB+ of HTML
- **Temporary Fix**: Strip script/style tags from inline content
- **Proper Solution**: 
  - Implement pagination in `_config.yml` (change `per_page: 0` to 20-50)
  - OR lazy-load short posts with JavaScript
  - OR limit number of inline posts displayed
- **Files**: `_config.yml`, `themes/san-diego/layout/_partial/blog-posts.ejs`

### Sass Deprecation Warnings
- **Issue**: Using legacy JS API that will be removed in Dart Sass 2.0.0
- **Impact**: Build will break when Sass updates
- **Solution**: Update hexo-renderer-sass configuration
- **Files**: `package.json`, build configuration

## Priority 2 - Architecture Issues

### Duplicate Scroll Implementations
- **Issue**: Three separate files implement scroll logic
- **Files**: 
  - `scroll.js` - General scroll functionality
  - `blog.js` - Blog-specific scrolling (lines 75-92, 491)
  - `anchor-links-simple.js` - Anchor link scrolling
- **Solution**: Create unified scroll utility module
- **Benefits**: Consistent behavior, easier maintenance

### Global Variable Pollution
- **Issue**: Heavy reliance on window.* variables
- **Examples**:
  - `window.mobileTabs`
  - `window.scrollToFullStory`
  - `window.initializeAnchorLinks`
  - `window.initializeSoundEffects`
- **Solution**: Implement proper module system (ES6 modules or similar)

### Event Handler Memory Leaks
- **Issue**: Event handlers not properly cleaned up
- **Example**: `blog.js` attempts cleanup but pattern not consistent
- **Solution**: 
  - Implement centralized event delegation
  - Use WeakMap for handler tracking
  - Add cleanup on page transitions

## Priority 3 - Code Quality

### Missing Error Handling
- **Issue**: Many functions assume elements exist
- **Impact**: Silent failures, hard to debug
- **Solution**: Add defensive checks and user feedback
- **Example**:
  ```javascript
  // Current
  const element = document.querySelector('.thing');
  element.classList.add('active'); // Fails if null
  
  // Better
  const element = document.querySelector('.thing');
  if (!element) {
    console.warn('Element .thing not found');
    return;
  }
  element.classList.add('active');
  ```

### Script Loading Race Conditions
- **Issue**: Scripts depend on others without formal dependencies
- **Example**: anchor-links depends on mobileTabs being initialized
- **Solution**: 
  - Use dynamic imports
  - Implement initialization queue
  - Add ready state checks

### Console Logging in Production
- **Issue**: Extensive console.log statements ship to production
- **Files**: Most JS files
- **Solution**: 
  - Implement debug mode flag
  - Use build process to strip logs
  - Create proper logging utility

## Priority 4 - Performance

### No Code Splitting
- **Issue**: All JS loaded regardless of page needs
- **Impact**: Unnecessary bandwidth usage
- **Solution**: 
  - Implement dynamic imports
  - Load features on-demand
  - Split vendor/app code

### Unoptimized Asset Loading
- **Issue**: No lazy loading for heavy components
- **Examples**: 
  - 3D skull model loads immediately
  - All carousel images load upfront
- **Solution**: Implement intersection observer pattern

## Recommended Fixes Order

1. **Fix Sass deprecation** - Prevents future build failures
2. **Implement pagination** - Solves HTML size issue properly  
3. **Consolidate scroll logic** - Reduces complexity
4. **Add error handling** - Improves reliability
5. **Module system** - Better architecture for future
6. **Performance optimizations** - Better user experience

## Priority 5 - Future Improvements

### Modern Framework Migration
- **Issue**: Hexo is aging, limited ecosystem
- **Options**: 
  - Astro (good for content sites)
  - Next.js (full-stack capabilities)
  - Nuxt (Vue ecosystem)
- **Benefits**: Better DX, modern features, edge functions
- **Effort**: Very High

### Component Library Extraction
- **Issue**: Theme components tightly coupled
- **Solution**: Extract to standalone package
- **Benefits**: Reusability, testing, documentation

### Automated Testing
- **Issue**: No test coverage
- **Needed**:
  - Unit tests for utilities
  - Integration tests for build
  - Visual regression tests
  - Accessibility tests

## Tracking

| Issue | Priority | Effort | Status | Owner | Date |
|-------|----------|--------|--------|-------|------|
| HTML Size Limit | P1 | Medium | Temporary fix applied | - | 2025-06-15 |
| Sass Deprecation | P1 | Low | Not started | - | - |
| Duplicate Scrolling | P2 | Medium | Not started | - | - |
| Global Variables | P2 | High | Not started | - | - |
| Event Handler Leaks | P2 | Medium | Not started | - | - |
| Error Handling | P3 | Medium | Not started | - | - |
| Script Race Conditions | P3 | Medium | Not started | - | - |
| Console Logs | P3 | Low | Not started | - | - |
| Code Splitting | P4 | High | Not started | - | - |
| Asset Lazy Loading | P4 | Medium | Not started | - | - |
| Framework Migration | P5 | Very High | Research phase | - | - |
| Component Library | P5 | High | Not started | - | - |
| Test Coverage | P5 | High | Not started | - | - |

## Resolution Guidelines

### For Contributors
1. Pick an issue matching your skill level
2. Create a feature branch
3. Implement fix with tests (when applicable)
4. Update documentation
5. Submit PR with clear description

### For Maintainers
1. Review quarterly
2. Adjust priorities based on impact
3. Balance debt reduction with features
4. Document decisions in ADRs

## Debt Metrics

### Current State (June 2025)
- **Critical Issues**: 2 (1 mitigated)
- **Total Issues**: 13
- **Estimated Effort**: ~3-4 months
- **Risk Level**: Medium

### Goals
- **Q3 2025**: Resolve all P1 issues
- **Q4 2025**: Address P2 architecture issues
- **2026**: Consider framework migration