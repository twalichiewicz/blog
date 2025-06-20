# Micro-Component Library Plan for thomas.design

## Overview

This document outlines the architecture and implementation plan for a micro-component library that integrates seamlessly with the existing Hexo-based blog while providing reusable, accessible, and performant components.

## Design Principles

1. **Progressive Enhancement**: Components work without JavaScript, enhanced when available
2. **Accessibility First**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
3. **Performance Focused**: Minimal bundle size, lazy loading, CSS containment
4. **Theme Aware**: Automatic light/dark mode support using existing system
5. **Mobile First**: Touch-friendly, responsive by default
6. **Developer Friendly**: Clear APIs, good documentation, TypeScript definitions (optional)

## Architecture

### Directory Structure

```
themes/san-diego/source/
├── components/                 # New component library
│   ├── core/                  # Core components
│   │   ├── button/
│   │   │   ├── button.scss
│   │   │   ├── button.js
│   │   │   └── button.ejs
│   │   ├── card/
│   │   ├── input/
│   │   └── modal/
│   ├── patterns/              # Composite components
│   │   ├── hero/
│   │   ├── gallery/
│   │   └── form/
│   ├── utilities/             # Helper functions
│   │   ├── dom.js
│   │   ├── events.js
│   │   └── a11y.js
│   ├── tokens/               # Design tokens
│   │   ├── _colors.scss
│   │   ├── _spacing.scss
│   │   └── _typography.scss
│   └── index.js              # Main entry point
```

### Component Structure

Each component follows a consistent structure:

```
component-name/
├── component-name.scss    # Styles (BEM methodology)
├── component-name.js      # JavaScript class
├── component-name.ejs     # EJS template partial
├── README.md             # Component documentation
└── examples.html         # Usage examples
```

## Component API Design

### JavaScript API

```javascript
// Base Component Class
class Component {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...this.constructor.defaults, ...options };
    this.state = {};
    this.init();
  }

  static defaults = {};
  static instances = new WeakMap();

  init() {
    // Setup component
    this.setupDOM();
    this.bindEvents();
    this.constructor.instances.set(this.element, this);
  }

  destroy() {
    // Cleanup
    this.unbindEvents();
    this.constructor.instances.delete(this.element);
  }

  // Lifecycle hooks
  setupDOM() {}
  bindEvents() {}
  unbindEvents() {}
}

// Example: Button Component
class Button extends Component {
  static defaults = {
    variant: 'default',
    size: 'medium',
    ripple: true,
    loadingText: 'Loading...'
  };

  setupDOM() {
    this.element.classList.add('btn', `btn--${this.options.variant}`);
    if (this.options.ripple) {
      this.setupRipple();
    }
  }

  setLoading(isLoading) {
    this.element.classList.toggle('is-loading', isLoading);
    this.element.disabled = isLoading;
  }
}
```

### SCSS API

```scss
// Component mixins
@mixin component-base($name) {
  .#{$name} {
    // Base styles
    position: relative;
    box-sizing: border-box;
    
    // States
    &.is-loading { }
    &.is-disabled { }
    &.is-active { }
    
    // Modifiers
    &--primary { }
    &--large { }
    
    // Elements
    &__icon { }
    &__text { }
  }
}

// Usage
@include component-base('btn') {
  // Component-specific styles
  @include button-reset;
  @include focus-visible;
  
  // Size variants
  &--small { 
    @include text-sm;
    padding: var(--space-1) var(--space-2);
  }
  
  // Theme support
  @include theme-light {
    background: var(--color-surface);
    color: var(--color-text);
  }
  
  @include theme-dark {
    background: var(--color-surface-dark);
    color: var(--color-text-dark);
  }
}
```

### EJS Template API

```ejs
<%# Button Component Template %>
<% 
  // Default options
  const defaults = {
    tag: 'button',
    variant: 'default',
    size: 'medium',
    icon: null,
    iconPosition: 'start',
    loading: false,
    disabled: false,
    fullWidth: false,
    href: null,
    attributes: {}
  };
  
  // Merge with provided options
  const props = { ...defaults, ...locals };
  const Tag = props.href ? 'a' : props.tag;
  
  // Build classes
  const classes = [
    'btn',
    `btn--${props.variant}`,
    `btn--${props.size}`,
    props.fullWidth && 'btn--full',
    props.loading && 'is-loading',
    props.disabled && 'is-disabled',
    props.class
  ].filter(Boolean).join(' ');
%>

<<%= Tag %>
  class="<%= classes %>"
  <% if (props.href) { %>href="<%= props.href %>"<% } %>
  <% if (props.disabled) { %>disabled<% } %>
  <% if (props.loading) { %>aria-busy="true"<% } %>
  <% Object.entries(props.attributes).forEach(([key, value]) => { %>
    <%= key %>="<%= value %>"
  <% }) %>
>
  <% if (props.icon && props.iconPosition === 'start') { %>
    <span class="btn__icon btn__icon--start"><%- props.icon %></span>
  <% } %>
  
  <span class="btn__text">
    <% if (props.loading && props.loadingText) { %>
      <%= props.loadingText %>
    <% } else { %>
      <%- props.children || props.text %>
    <% } %>
  </span>
  
  <% if (props.icon && props.iconPosition === 'end') { %>
    <span class="btn__icon btn__icon--end"><%- props.icon %></span>
  <% } %>
  
  <% if (props.loading) { %>
    <span class="btn__spinner" aria-hidden="true"></span>
  <% } %>
</<%= Tag %>>
```

## Component Catalog

### Core Components (Phase 1)

1. **Button**
   - Variants: default, primary, secondary, ghost, soft
   - Sizes: small, medium, large
   - States: loading, disabled, active
   - Features: ripple effect, icon support

2. **Card**
   - Variants: default, bordered, elevated, interactive
   - Sections: header, body, footer, media
   - Features: hover effects, click handling

3. **Input**
   - Types: text, email, password, textarea, select
   - States: error, success, disabled, loading
   - Features: floating labels, validation, icons

4. **Modal**
   - Variants: default, fullscreen, drawer
   - Features: focus trap, backdrop, animations

5. **Navigation**
   - Components: tabs, breadcrumbs, pagination
   - Features: keyboard navigation, ARIA support

### Pattern Components (Phase 2)

1. **Form Patterns**
   - Login/signup forms
   - Contact forms
   - Search forms

2. **Content Patterns**
   - Blog post cards
   - Portfolio items
   - Media galleries

3. **Layout Patterns**
   - Hero sections
   - Feature grids
   - Testimonials

### Utility Components (Phase 3)

1. **Tooltip**
2. **Dropdown**
3. **Alert/Toast**
4. **Progress indicators**
5. **Skeleton loaders**

## Integration Strategy

### 1. Build Process Integration

```javascript
// hexo-scripts/component-builder.js
hexo.extend.generator.register('components', function(locals) {
  // Generate component documentation
  // Bundle component assets
  // Create component preview pages
});

hexo.extend.helper.register('component', function(name, options) {
  // Helper to include components in templates
  return partial(`components/core/${name}/${name}`, options);
});
```

### 2. Asset Pipeline

```javascript
// Modify scripts/build-theme-assets.js
const componentStyles = glob.sync('source/components/**/*.scss');
const componentScripts = glob.sync('source/components/**/*.js');

// Add to build process
await buildStyles([...existingStyles, ...componentStyles]);
await buildScripts([...existingScripts, ...componentScripts]);
```

### 3. Usage in Templates

```ejs
<!-- Using the component helper -->
<%- component('button', {
  variant: 'primary',
  size: 'large',
  text: 'Get Started',
  icon: 'arrow-right',
  href: '/get-started'
}) %>

<!-- Direct partial include -->
<%- partial('components/core/card/card', {
  title: post.title,
  content: post.excerpt,
  link: url_for(post.path)
}) %>
```

### 4. JavaScript Initialization

```javascript
// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  // Find all components
  const components = document.querySelectorAll('[data-component]');
  
  components.forEach(element => {
    const componentName = element.dataset.component;
    const options = JSON.parse(element.dataset.componentOptions || '{}');
    
    // Dynamic import
    import(`./components/core/${componentName}/${componentName}.js`)
      .then(module => {
        new module.default(element, options);
      });
  });
});

// Manual initialization
import Button from './components/core/button/button.js';
const button = new Button(document.querySelector('.my-button'), {
  variant: 'primary'
});
```

## Testing Strategy

### 1. Visual Regression Testing

```javascript
// components/test/visual.js
const components = ['button', 'card', 'input'];
const variants = ['default', 'primary', 'disabled'];
const themes = ['light', 'dark'];

// Generate test matrix
components.forEach(component => {
  variants.forEach(variant => {
    themes.forEach(theme => {
      // Capture screenshot
      // Compare with baseline
    });
  });
});
```

### 2. Accessibility Testing

```javascript
// components/test/a11y.js
import { axe } from 'axe-core';

async function testComponent(component) {
  const results = await axe.run(component);
  return results.violations.length === 0;
}
```

### 3. Unit Testing

```javascript
// components/core/button/button.test.js
describe('Button Component', () => {
  it('should initialize with default options', () => {
    const button = new Button(element);
    expect(button.options.variant).toBe('default');
  });
  
  it('should handle loading state', () => {
    button.setLoading(true);
    expect(element.classList.contains('is-loading')).toBe(true);
  });
});
```

## Documentation Strategy

### 1. Component Documentation

Each component includes:
- API reference
- Usage examples
- Accessibility notes
- Browser support
- Migration guides

### 2. Living Style Guide

```ejs
<!-- components/docs/index.ejs -->
<div class="component-docs">
  <% components.forEach(component => { %>
    <section id="<%= component.name %>">
      <h2><%= component.title %></h2>
      
      <!-- Live examples -->
      <div class="component-examples">
        <%- component.examples %>
      </div>
      
      <!-- Code snippets -->
      <div class="component-code">
        <pre><code><%- component.code %></code></pre>
      </div>
      
      <!-- Props table -->
      <table class="component-props">
        <% component.props.forEach(prop => { %>
          <tr>
            <td><%= prop.name %></td>
            <td><%= prop.type %></td>
            <td><%= prop.default %></td>
            <td><%= prop.description %></td>
          </tr>
        <% }) %>
      </table>
    </section>
  <% }) %>
</div>
```

### 3. Interactive Playground

```javascript
// Component playground
class ComponentPlayground {
  constructor(element) {
    this.component = element.querySelector('.playground-component');
    this.controls = element.querySelector('.playground-controls');
    this.code = element.querySelector('.playground-code');
    
    this.setupControls();
  }
  
  updateComponent(options) {
    // Reinitialize component with new options
    // Update code display
  }
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
- Set up component directory structure
- Create base component class
- Implement design token system
- Build first 3 core components (Button, Card, Input)

### Phase 2: Core Components (Week 3-4)
- Complete remaining core components
- Add documentation system
- Implement auto-initialization
- Create visual regression tests

### Phase 3: Integration (Week 5-6)
- Migrate existing components to new system
- Update templates to use new components
- Add component helper functions
- Performance optimization

### Phase 4: Enhancement (Week 7-8)
- Add pattern components
- Implement interactive documentation
- Create migration guides
- Launch component library

## Performance Considerations

1. **Bundle Size**
   - Tree-shaking support
   - Modular imports
   - CSS containment
   - Minimal dependencies

2. **Runtime Performance**
   - Lazy initialization
   - Event delegation
   - RequestIdleCallback for non-critical setup
   - Intersection Observer for viewport-based init

3. **CSS Performance**
   - CSS custom properties for theming
   - Logical properties for RTL support
   - Container queries where appropriate
   - Will-change hints for animations

## Maintenance Plan

1. **Versioning**: Semantic versioning for components
2. **Deprecation**: 2-version deprecation policy
3. **Browser Support**: Last 2 versions + IE11 (graceful degradation)
4. **Updates**: Monthly review and update cycle
5. **Community**: Open for contributions with clear guidelines

## Success Metrics

1. **Developer Experience**
   - Time to implement new features
   - Code reusability percentage
   - Documentation completeness

2. **User Experience**
   - Page load performance
   - Accessibility audit scores
   - Cross-browser compatibility

3. **Maintenance**
   - Bug resolution time
   - Update frequency
   - Community engagement

This plan provides a solid foundation for building a component library that enhances the existing blog while maintaining its unique character and excellent performance.