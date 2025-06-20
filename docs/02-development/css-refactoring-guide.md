# CSS/SCSS Refactoring Guide

## Overview

This guide consolidates the CSS/SCSS refactoring strategy for the blog's codebase. The refactoring aims to transform the current stylesheet chaos into a well-organized, maintainable, and performant styling system using modern CSS and SCSS best practices.

## Current State Analysis

### Codebase Metrics
- **Total SCSS Files**: 26 files
- **Total Size**: ~125KB uncompressed
- **!important usage**: 400+ instances (critical issue)
- **Selector Depth**: Up to 7 levels deep
- **Media Query Duplicates**: 85+ instances
- **Color Definitions**: 50+ hardcoded values
- **Z-index Values**: 15+ arbitrary numbers

### Major Issues Identified

1. **Specificity Wars**: 400+ !important declarations indicate specificity battles
2. **No Design System**: Colors, spacing, typography scattered throughout
3. **Media Query Chaos**: Same breakpoints defined 85+ times
4. **Deep Nesting**: Selectors up to 7 levels deep
5. **No Component Architecture**: Styles mixed between files
6. **Legacy Code**: Vendor prefixes for IE9, unused styles
7. **Performance Issues**: Large selectors, redundant rules

### Technical Debt Summary
- **Maintainability Score**: 3/10
- **Performance Impact**: ~50ms render blocking
- **Developer Experience**: Poor (hard to find/modify styles)
- **Risk Level**: High (changes often break unrelated components)

## Goals & Target Metrics

### Technical Goals
1. **Modern Architecture**: Component-based SCSS structure
2. **Design System**: Centralized tokens and utilities
3. **Zero !important**: Proper specificity management
4. **Performance**: <20KB critical CSS
5. **Maintainability**: Clear naming conventions

### Target Metrics
- **!important usage**: 0 (from 400+)
- **Max Nesting**: 3 levels (from 7)
- **File Organization**: Component-based
- **Build Size**: ~80KB (from 125KB)
- **Critical CSS**: <20KB inline

## Architecture Design

### 1. Design System Foundation

```scss
// 01-settings/_tokens.scss
$tokens: (
  // Colors
  color: (
    primary: (
      50: #e3f2fd,
      100: #bbdefb,
      500: #2196f3,
      900: #0d47a1
    ),
    neutral: (
      0: #ffffff,
      100: #f5f5f5,
      900: #212121
    )
  ),
  
  // Spacing
  spacing: (
    0: 0,
    1: 0.25rem,  // 4px
    2: 0.5rem,   // 8px
    3: 0.75rem,  // 12px
    4: 1rem,     // 16px
    6: 1.5rem,   // 24px
    8: 2rem,     // 32px
    12: 3rem,    // 48px
    16: 4rem     // 64px
  ),
  
  // Typography
  font: (
    family: (
      sans: #{'Inter', -apple-system, BlinkMacSystemFont, sans-serif},
      mono: #{'JetBrains Mono', 'Courier New', monospace}
    ),
    size: (
      xs: 0.75rem,   // 12px
      sm: 0.875rem,  // 14px
      base: 1rem,    // 16px
      lg: 1.125rem,  // 18px
      xl: 1.25rem,   // 20px
      '2xl': 1.5rem, // 24px
      '3xl': 2rem,   // 32px
      '4xl': 2.5rem  // 40px
    )
  )
);
```

### 2. Component Structure

```scss
// 05-components/_button.scss
.btn {
  // Base styles
  @include reset-button;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: spacing(2) spacing(4);
  font-size: font-size(base);
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  border-radius: radius(md);
  transition: all duration(fast) easing(default);
  
  // Variants
  &--primary {
    background-color: color(primary, 500);
    color: color(neutral, 0);
    
    @include hover {
      background-color: color(primary, 600);
    }
  }
  
  &--secondary {
    background-color: transparent;
    color: color(primary, 500);
    border: 1px solid color(primary, 500);
    
    @include hover {
      background-color: color(primary, 50);
    }
  }
  
  // Sizes
  &--sm {
    padding: spacing(1) spacing(3);
    font-size: font-size(sm);
  }
  
  &--lg {
    padding: spacing(3) spacing(6);
    font-size: font-size(lg);
  }
  
  // States
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

### 3. Utility System

```scss
// 02-tools/_utilities.scss
@mixin generate-utilities {
  // Spacing utilities
  @each $side in (top, right, bottom, left) {
    @each $size, $value in map-get($tokens, spacing) {
      .m#{str-slice($side, 0, 1)}-#{$size} {
        margin-#{$side}: $value;
      }
      .p#{str-slice($side, 0, 1)}-#{$size} {
        padding-#{$side}: $value;
      }
    }
  }
  
  // Color utilities
  @each $name, $shades in map-get($tokens, color) {
    @each $shade, $value in $shades {
      .text-#{$name}-#{$shade} {
        color: $value;
      }
      .bg-#{$name}-#{$shade} {
        background-color: $value;
      }
    }
  }
}
```

### 4. Modern CSS Features

```scss
// Use CSS Custom Properties for runtime theming
:root {
  // Generate CSS variables from tokens
  @each $category, $values in $tokens {
    @each $key, $value in $values {
      @if type-of($value) == 'map' {
        @each $subkey, $subvalue in $value {
          --#{$category}-#{$key}-#{$subkey}: #{$subvalue};
        }
      } @else {
        --#{$category}-#{$key}: #{$value};
      }
    }
  }
}

// Dark mode with CSS variables
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--color-neutral-900);
    --color-text: var(--color-neutral-100);
  }
}
```

## Implementation Plan

### Phase 1: Foundation (Week 1)

1. **Create Token System**
   ```scss
   // _tokens.scss
   $tokens: (
     color: (...),
     spacing: (...),
     typography: (...),
     shadows: (...),
     breakpoints: (...)
   );
   ```

2. **Build Mixins Library**
   ```scss
   // _mixins.scss
   @mixin responsive($breakpoint) { ... }
   @mixin hover { ... }
   @mixin focus-visible { ... }
   @mixin truncate($lines: 1) { ... }
   ```

3. **Setup Build Pipeline**
   - PostCSS for autoprefixing
   - PurgeCSS for unused styles
   - CSS Modules support

### Phase 2: Component Migration (Week 2-3)

1. **Audit Existing Components**
   - List all UI components
   - Map current styles to new structure
   - Identify shared patterns

2. **Create Component Files**
   ```
   components/
   ├── _button.scss
   ├── _card.scss
   ├── _navigation.scss
   ├── _form.scss
   └── _modal.scss
   ```

3. **Migrate Gradually**
   - Start with leaf components
   - Test each migration
   - Update HTML classes

### Phase 3: Layout System (Week 4)

1. **Modern Grid System**
   ```scss
   .container {
     --container-width: min(100% - 2rem, 1200px);
     width: var(--container-width);
     margin-inline: auto;
   }
   
   .grid {
     display: grid;
     gap: var(--spacing-4);
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   }
   ```

2. **Flexbox Utilities**
   ```scss
   .flex { display: flex; }
   .flex-col { flex-direction: column; }
   .items-center { align-items: center; }
   .justify-between { justify-content: space-between; }
   ```

### Phase 4: Cleanup (Week 5)

1. **Remove !important**
   - Fix specificity issues
   - Flatten selectors
   - Use CSS layers

2. **Delete Dead Code**
   - Run coverage analysis
   - Remove unused styles
   - Consolidate duplicates

3. **Optimize Output**
   - Minify CSS
   - Extract critical CSS
   - Implement caching

## Migration Examples

### Example 1: Fixing !important Overuse

#### Before
```scss
.post-preview-card {
  h3 {
    color: #333 !important;
    
    .blog-context & {
      color: #000 !important;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    h3 {
      color: #fff !important;
    }
  }
}
```

#### After
```scss
.post-preview-card {
  --card-title-color: var(--color-neutral-800);
  
  &__title {
    color: var(--card-title-color);
  }
}

.blog-context {
  --card-title-color: var(--color-neutral-900);
}

@media (prefers-color-scheme: dark) {
  .post-preview-card {
    --card-title-color: var(--color-neutral-100);
  }
}
```

### Example 2: Component Architecture

#### Before
```scss
// Scattered across multiple files
.nav { ... }
.navigation { ... }
.nav-menu { ... }
.mobile-nav { ... }
#site-nav { ... }
```

#### After
```scss
// components/_navigation.scss
.nav {
  // Block
  &__container { ... }
  &__menu { ... }
  &__item { ... }
  &__link { ... }
  
  // Modifiers
  &--mobile { ... }
  &--sticky { ... }
  
  // States
  &.is-open { ... }
  &.is-scrolled { ... }
}
```

### Example 3: Design Tokens

#### Before
```scss
// Hardcoded everywhere
.component {
  margin: 16px;
  padding: 8px 12px;
  color: #333333;
  background: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

#### After
```scss
.component {
  margin: spacing(4);
  padding: spacing(2) spacing(3);
  color: color(neutral, 800);
  background: color(neutral, 100);
  border-radius: radius(sm);
  box-shadow: shadow(sm);
}
```

## Best Practices

### 1. Naming Conventions

```scss
// BEM for components
.block__element--modifier { }

// Utility classes
.u-text-center { }
.u-mt-4 { }

// State classes
.is-active { }
.has-error { }
```

### 2. Specificity Management

```scss
// Use CSS Layers
@layer base {
  // Reset and base styles
}

@layer components {
  // Component styles
}

@layer utilities {
  // Utility classes
}
```

### 3. Performance Optimization

```scss
// Avoid expensive selectors
// Bad
.nav li a:hover { }

// Good
.nav__link:hover { }

// Use CSS containment
.component {
  contain: layout style;
}
```

## Testing Strategy

### Visual Regression Testing
```bash
# Before changes
npm run screenshot:baseline

# After changes
npm run screenshot:compare
```

### Performance Testing
```bash
# Measure CSS performance
npm run css:analyze

# Check specificity graph
npm run css:specificity
```

### Coverage Analysis
```bash
# Find unused CSS
npm run css:coverage

# Bundle size check
npm run build:analyze
```

## Success Metrics

### Quantitative Metrics
- **!important count**: 0 (from 400+)
- **Build size**: 80KB (from 125KB)
- **Specificity graph**: Flat (from mountainous)
- **Unused CSS**: <5% (from ~30%)

### Qualitative Metrics
- **Developer satisfaction**: High
- **Time to implement feature**: -50%
- **Bug reports**: -70%
- **Code review time**: -40%

## Long-term Maintenance

### 1. Documentation
- Component library with examples
- Design token documentation
- Migration guide for new developers

### 2. Tooling
- Stylelint for consistency
- PostCSS plugins for optimization
- Build-time checks for regression

### 3. Governance
- CSS code reviews required
- Token changes need approval
- Performance budgets enforced

---

*For more documentation, see [README](/docs/README.md)*