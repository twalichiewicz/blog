# Alert Message Component

A reusable component for displaying callouts, links, and important messages in blog posts.

## Basic Usage

### Simple Alert
```html
<div class="alert-message">
  <div class="alert-title">Alert Title</div>
  <div class="alert-description">This is the alert description text.</div>
</div>
```

### Clickable Link Alert
```html
<a href="https://example.com" class="alert-message alert-link">
  <div class="alert-title">Link Title</div>
  <div class="alert-description">Click to visit the link</div>
</a>
```

### External Link
Add the `external` class to the title to show an arrow indicator:
```html
<a href="https://example.com" target="_blank" class="alert-message alert-link">
  <div class="alert-title external">External Link</div>
  <div class="alert-description">Opens in a new tab</div>
</a>
```

## Variants

### Color Variants
- `alert-info` - Blue theme (default for links)
- `alert-success` - Green theme
- `alert-warning` - Yellow/orange theme
- `alert-error` - Red theme

```html
<div class="alert-message alert-success">
  <div class="alert-title">Success!</div>
  <div class="alert-description">Operation completed successfully.</div>
</div>
```

### Size Variants
- Default size - Standard padding and font sizes
- `alert-compact` - Reduced padding and smaller text

```html
<div class="alert-message alert-compact">
  <div class="alert-title">Compact Alert</div>
  <div class="alert-description">Takes up less space</div>
</div>
```

### With Icon
Add `has-icon` class and include an icon element:
```html
<div class="alert-message has-icon alert-info">
  <div class="alert-icon">ℹ️</div>
  <div class="alert-content">
    <div class="alert-title">Information</div>
    <div class="alert-description">This alert has an icon</div>
  </div>
</div>
```

## Features

- **Responsive** - Adjusts padding and font sizes on mobile
- **Dark mode support** - Automatically adapts to theme
- **Hover effects** - Link alerts lift on hover with shadow
- **Accessible** - Semantic HTML with proper link styling
- **Self-contained** - All styles included in the component

## Examples in Use

### Demo Link (as used in iOS monobutton post)
```html
<a href="https://twalichiewicz.github.io/monophone-demo/" target="_blank" rel="noopener" class="alert-message alert-link alert-info">
  <div class="alert-title external">Try the Monophone Demo</div>
  <div class="alert-description">Interactive prototype demonstrating thumb-first navigation</div>
</a>
```

### Important Note
```html
<div class="alert-message alert-warning">
  <div class="alert-title">Note</div>
  <div class="alert-description">This feature requires JavaScript to be enabled.</div>
</div>
```

### Related Content
```html
<a href="/2025/01/06/related-post/" class="alert-message alert-link">
  <div class="alert-title">Related: Another Post Title</div>
  <div class="alert-description">Continue reading about this topic</div>
</a>
```