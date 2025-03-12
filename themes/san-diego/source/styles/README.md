# San Diego Theme Styles

A simplified and maintainable styling system for the San Diego theme.

## Structure

```
styles/
├── main.scss         # Main entry point
├── base.scss         # Base styles (variables, reset, typography)
├── layout.scss       # Layout styles (grid, responsive, header, footer)
├── components.scss   # All component styles
└── utilities.scss    # Helper classes and utilities
```

## File Descriptions

### main.scss

The main entry point that imports all other style modules. This file is responsible for bringing together all the different parts of the styling system.

### base.scss

Contains foundational styles and variables:

- Color variables and CSS custom properties
- Typography settings
- Reset styles
- Base element styles

### layout.scss

Contains structural and layout-related styles:

- Responsive mixins
- Grid system
- Header styles
- Footer styles
- Container layouts

### components.scss

Contains all component-specific styles:

- Profile components
- Blog components
- Post components
- Project components
- Interactive components
- Search components
- Navigation components

### utilities.scss

Contains helper classes and utility functions:

- Display utilities
- Spacing utilities
- Text utilities
- Animations
- Dark mode utilities

## Usage

### Variables and Custom Properties

The theme uses both SCSS variables and CSS custom properties:

```scss
// SCSS Variables (in base.scss)
$space-md: 1rem;
$mobile-breakpoint: 768px;

// CSS Custom Properties
:root {
  --text-color: hsl(24, 3%, 35%);
  --body-bg: hsl(35, 15%, 88%);
}
```

### Responsive Design

The theme includes several responsive mixins:

```scss
@include mobile { ... }        // < 768px
@include tablet { ... }        // 768px - 1023px
@include desktop { ... }       // >= 1024px
@include tablet-and-up { ... } // >= 768px
@include dark-mode { ... }     // Dark mode styles
```

### Utility Classes

Common utility classes follow a consistent naming pattern:

```scss
// Display
.d-none, .d-block, .d-flex

// Spacing
.m-0 through .m-5 (margin)
.p-0 through .p-5 (padding)

// Text
.text-center, .text-bold, .text-uppercase

// Animations
.fade-in, .slide-in
```

## Development

### Building Styles

The styles are processed using Sass. To build:

```bash
npm run build:css     # Build styles
npm run watch:css     # Watch for changes
```

### Adding New Styles

1. Add variables to `base.scss`
2. Add layout styles to `layout.scss`
3. Add component styles to `components.scss`
4. Add utility classes to `utilities.scss`

### Best Practices

- Use CSS custom properties for values that change in different themes/modes
- Follow the existing naming conventions
- Keep components modular and self-contained
- Use utility classes for common patterns
- Document any complex components or utilities

## Browser Support

The theme supports modern browsers and includes fallbacks for older browsers where necessary. Dark mode support is provided through the `prefers-color-scheme` media query.
