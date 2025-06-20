# Button Component

A flexible, accessible button component with multiple variants, sizes, and states.

## Features

- **Multiple variants**: default, primary, secondary, ghost, soft
- **Three sizes**: small, medium, large
- **Accessible**: Full keyboard support, ARIA attributes, focus management
- **States**: loading, disabled, pressed
- **Icons**: Support for icons at start or end positions
- **Effects**: Optional ripple effect and sound feedback
- **Flexible**: Can render as `<button>`, `<a>`, or `<input>`

## Usage

### Basic Button

```ejs
<%- include('components/core/button/button', {
  text: 'Click me',
  variant: 'primary'
}) %>
```

### Link Button

```ejs
<%- include('components/core/button/button', {
  text: 'Learn more',
  href: '/about',
  variant: 'secondary'
}) %>
```

### Button with Icon

```ejs
<%- include('components/core/button/button', {
  text: 'Download',
  icon: '<svg>...</svg>',
  iconPosition: 'start',
  variant: 'primary'
}) %>
```

### Loading Button

```ejs
<%- include('components/core/button/button', {
  text: 'Submit',
  loading: true,
  loadingText: 'Submitting...',
  variant: 'primary'
}) %>
```

### Icon-Only Button

```ejs
<%- include('components/core/button/button', {
  icon: '<svg>...</svg>',
  iconOnly: true,
  ariaLabel: 'Settings',
  variant: 'ghost'
}) %>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tag` | string | 'button' | HTML tag to use ('button', 'a', 'input') |
| `variant` | string | 'default' | Visual style variant |
| `size` | string | 'md' | Button size ('sm', 'md', 'lg') |
| `type` | string | 'button' | Button type attribute |
| `href` | string | null | URL for link buttons |
| `icon` | string | null | HTML/SVG string for icon |
| `iconPosition` | string | 'start' | Icon position ('start', 'end') |
| `loading` | boolean | false | Show loading state |
| `disabled` | boolean | false | Disable button |
| `fullWidth` | boolean | false | Make button full width |
| `pill` | boolean | false | Use pill shape |
| `iconOnly` | boolean | false | Icon-only button |
| `ripple` | boolean | true | Enable ripple effect |
| `soundEffect` | boolean | true | Play sound on click |
| `loadingText` | string | 'Loading...' | Text shown when loading |
| `ariaLabel` | string | null | Accessibility label |
| `ariaPressed` | boolean | null | For toggle buttons |
| `ariaExpanded` | boolean | null | For dropdown triggers |
| `text` | string | '' | Button text content |

## JavaScript API

### Initialization

Buttons are auto-initialized if they have `data-component="button"`:

```html
<button data-component="button" data-button-options='{"variant": "primary"}'>
  Click me
</button>
```

Or initialize manually:

```javascript
import Button from '/components/core/button/button.js';

const button = new Button(element, {
  variant: 'primary',
  ripple: true
});
```

### Methods

```javascript
// Set loading state
button.setLoading(true, 'Processing...');

// Enable/disable
button.enable();
button.disable();

// Update text
button.setText('New text');

// Update icon
button.setIcon('<svg>...</svg>', 'end');

// Programmatic click
button.click();

// Focus management
button.focus();
button.blur();

// Destroy
button.destroy();
```

### Events

```javascript
// Listen for button clicks
element.addEventListener('btn:click', (e) => {
  console.log('Button clicked', e.detail.button);
});

// Loading state changes
element.addEventListener('btn:loading:start', (e) => {
  console.log('Loading started');
});

element.addEventListener('btn:loading:end', (e) => {
  console.log('Loading ended');
});
```

## Styling

### CSS Custom Properties

```css
.btn {
  /* Override design tokens */
  --btn-height: 40px;
  --btn-padding: 0 24px;
  --btn-font-size: 16px;
  --btn-border-radius: 12px;
}
```

### Custom Variants

Create custom button variants:

```scss
.btn--custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }
}
```

## Accessibility

- Full keyboard support (Enter/Space activation)
- Proper ARIA attributes for states
- Focus visible indicators
- Screen reader announcements for loading states
- Disabled state handling for all button types

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 with graceful degradation (no ripple effect)
- Touch-friendly with haptic feedback support

## Examples

### Button Group

```ejs
<div class="btn-group">
  <%- include('components/core/button/button', {
    text: 'Previous',
    variant: 'secondary'
  }) %>
  <%- include('components/core/button/button', {
    text: 'Next',
    variant: 'primary'
  }) %>
</div>
```

### Form Submit Button

```ejs
<form>
  <!-- form fields -->
  <%- include('components/core/button/button', {
    text: 'Submit',
    type: 'submit',
    variant: 'primary',
    fullWidth: true,
    disableOnClick: true
  }) %>
</form>
```

### Toggle Button

```ejs
<%- include('components/core/button/button', {
  text: 'Notifications',
  variant: 'ghost',
  ariaPressed: false,
  attributes: {
    'data-toggle': 'notifications'
  }
}) %>
```