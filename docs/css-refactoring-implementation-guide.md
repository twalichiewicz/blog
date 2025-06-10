# CSS Refactoring Implementation Guide

## Quick Start Implementation

This guide provides step-by-step instructions to implement the CSS refactoring plan while maintaining the exact same visual output.

## Step 1: Create Foundation Files (Day 1)

### 1.1 Create the new directory structure
```bash
cd themes/san-diego/source/styles
mkdir -p refactored/{base,components,utilities,layouts}
```

### 1.2 Create core token files
```scss
// refactored/base/_index.scss
@forward 'design-tokens';
@forward 'color-system';
@forward 'reset';
```

### 1.3 Update main styles.scss
```scss
// styles.scss - Gradual migration approach
// Phase 1: Import new system alongside old
@use 'refactored/base';
@use 'refactored/utilities';
@use 'refactored/components';

// Existing imports (to be removed gradually)
@import 'variables';
// ... rest of existing imports
```

## Step 2: Migrate Components Incrementally (Days 2-5)

### 2.1 Start with the most problematic files

**Priority Order:**
1. `_layout-fixes.scss` → Refactor into proper container structure
2. `_blog.scss` → Use new component system
3. `_post.scss` & `_project.scss` → Merge into unified content system
4. `_typography.scss` → Replace with utility classes

### 2.2 Component Migration Pattern

```scss
// OLD: _blog.scss (800+ lines)
.blog-list-item {
    // 50+ lines of styles
    @media (prefers-color-scheme: dark) {
        // 30+ lines of overrides
    }
}

// NEW: refactored/components/_blog-list.scss (50 lines)
.blog-list {
    &__item {
        @extend .card; // Inherits all base styles
        // Only blog-specific modifications
    }
}
```

## Step 3: Testing Strategy (Ongoing)

### 3.1 Visual Regression Testing
```bash
# Before refactoring
npm run build:prod
cp -r public public-before

# After each component migration
npm run build:prod
diff -r public-before public
```

### 3.2 Create test pages
```html
<!-- test-refactored.html -->
<link rel="stylesheet" href="/css/styles-refactored.css">
<!-- Compare side-by-side with original -->
```

## Step 4: Gradual Rollout (Days 6-10)

### 4.1 Feature flag approach
```javascript
// In layout files
const useRefactoredCSS = process.env.USE_REFACTORED_CSS === 'true';
const cssFile = useRefactoredCSS ? 'styles-refactored.css' : 'styles.css';
```

### 4.2 A/B testing
- Deploy refactored CSS to staging
- Monitor for visual differences
- Gather performance metrics

## Migration Checklist

### Phase 1: Foundation ✓
- [ ] Create design tokens file
- [ ] Create color system with automatic dark mode
- [ ] Create typography utilities
- [ ] Create layout utilities
- [ ] Create responsive mixins

### Phase 2: Core Components ✓
- [ ] Create base card component
- [ ] Create base button component
- [ ] Create container/layout components
- [ ] Create form components
- [ ] Create navigation components

### Phase 3: Feature Components ✓
- [ ] Migrate blog list
- [ ] Migrate post/project content
- [ ] Migrate portfolio grid
- [ ] Migrate profile/sidebar
- [ ] Migrate header/footer

### Phase 4: Cleanup ✓
- [ ] Remove _layout-fixes.scss
- [ ] Remove _mobile-scroll-fix.scss
- [ ] Remove _dynamic-content-scroll-fix.scss
- [ ] Consolidate _variables.scss and _var.scss
- [ ] Remove unused mixins and functions

### Phase 5: Optimization ✓
- [ ] Run CSS purge for unused styles
- [ ] Minify and compress
- [ ] Update build pipeline
- [ ] Update documentation

## Common Migration Patterns

### Pattern 1: Replace hardcoded values
```scss
// Before
padding: 16px;
margin-bottom: 24px;
color: #5b5856;

// After
padding: var(--space-4);
margin-bottom: var(--space-5);
color: var(--color-text-primary);
```

### Pattern 2: Replace media queries
```scss
// Before
@media (max-width: 768px) { }
@media (max-width: variables.$mobile-breakpoint) { }
@include device-breakpoints.mobile-only { }

// After (pick one approach)
@include mobile-only { }
```

### Pattern 3: Replace dark mode overrides
```scss
// Before
@media (prefers-color-scheme: dark) {
    color: #fff;
    background: #1a1a1a;
}

// After (automatic with variables)
color: var(--color-text-primary);
background: var(--color-bg-primary);
```

### Pattern 4: Replace !important with proper specificity
```scss
// Before
.blog-content {
    overflow: hidden !important;
}

// After (proper structure)
.blog-content {
    @extend .scroll-container;
    overflow: hidden; // No !important needed
}
```

## Performance Monitoring

### Metrics to Track
1. **CSS File Size**: Target 60% reduction
2. **Build Time**: Target 30% faster
3. **Page Load Time**: Measure with Lighthouse
4. **Render Performance**: Check for layout shifts

### Commands
```bash
# Check file sizes
ls -lh public/css/

# Analyze bundle
npm run analyze

# Performance test
lighthouse https://localhost:4000 --view
```

## Rollback Plan

If issues arise:
1. Keep original SCSS files intact during migration
2. Use git branches for each major component
3. Maintain both CSS files during transition
4. Quick rollback: `git checkout main -- themes/san-diego/source/styles`

## Success Criteria

✅ **Visual**: Pixel-perfect match with original design
✅ **Performance**: 60% smaller CSS bundle
✅ **Maintainability**: Zero !important flags
✅ **Consistency**: Single source of truth for all tokens
✅ **Dark Mode**: Automatic with no manual overrides
✅ **Developer Experience**: Clear, predictable utilities

## Next Steps After Refactoring

1. **Documentation**: Update style guide with new patterns
2. **Component Library**: Build Storybook for components
3. **Design Tokens**: Export for design tools (Figma)
4. **Performance**: Implement critical CSS
5. **Future-proofing**: Add CSS container queries