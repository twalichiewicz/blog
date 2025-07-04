# Font System Redesign Plan

## Overview
Complete typography system overhaul inspired by Linear, GitHub Primer, and modern best practices for 2024.

## Core Principles
1. **Simplicity**: Limited font sizes (4-6 variations max)
2. **Consistency**: Single source of truth using CSS custom properties
3. **Scalability**: rem-based units with responsive scaling
4. **Accessibility**: Minimum 16px body text on mobile
5. **Performance**: System font stack with Inter as primary

## Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
```

## Type Scale (1.25 ratio)
```css
/* Base: 16px = 1rem */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

## Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

## Line Heights
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## Letter Spacing
```css
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
```

## Typography Components

### Headings
```css
--heading-1: {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

--heading-2: {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

--heading-3: {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

--heading-4: {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}
```

### Body Text
```css
--body-large: {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

--body-base: {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

--body-small: {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

--caption: {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-wide);
}
```

### Code
```css
--code-inline: {
  font-family: var(--font-mono);
  font-size: 0.875em;
  font-weight: var(--font-weight-normal);
}

--code-block: {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}
```

## Responsive Scaling
```css
/* Mobile-first approach */
:root {
  font-size: 16px;
}

@media (min-width: 768px) {
  :root {
    font-size: 17px;
  }
}

@media (min-width: 1280px) {
  :root {
    font-size: 18px;
  }
}
```

## Utility Classes
```css
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-4xl { font-size: var(--font-size-4xl); }

.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

.leading-tight { line-height: var(--line-height-tight); }
.leading-normal { line-height: var(--line-height-normal); }
.leading-relaxed { line-height: var(--line-height-relaxed); }

.tracking-tight { letter-spacing: var(--letter-spacing-tight); }
.tracking-normal { letter-spacing: var(--letter-spacing-normal); }
.tracking-wide { letter-spacing: var(--letter-spacing-wide); }
```

## Implementation Steps
1. Create new `_typography-system.scss` file with all tokens
2. Replace all hard-coded font values with new variables
3. Remove duplicate font declarations
4. Update component styles to use new system
5. Test across all breakpoints and components
6. Document usage patterns

## Migration Strategy
1. Audit all current font usage
2. Map old values to new system
3. Create migration script to update files
4. Test each component after migration
5. Remove old typography files