# Prototype Sandbox Component

A reusable sandbox system for blog prototypes that provides isolation, common controls, and prevents scroll/event leakage.

## Features

- **Event Isolation**: Prevents click/scroll events from affecting the main page
- **Scroll Containment**: Keeps scrolling within the prototype
- **Play Button**: Requires user interaction to start (no auto-play)
- **Common Controls**: Reset and fullscreen buttons
- **Focus Trapping**: Keyboard navigation stays within prototype
- **Theme Support**: YouTube, SoundCloud, or generic styling
- **Responsive**: Works on all devices

## Usage

### Basic HTML Structure

```html
<!-- Wrap your prototype in a container with data attribute -->
<div data-prototype-sandbox='{"theme": "youtube", "autoStart": false}'>
  <!-- Your prototype HTML goes here -->
  <div class="youtube-demo">
    <!-- ... -->
  </div>
</div>
```

### JavaScript API

```javascript
// Manual initialization
const element = document.querySelector('.my-prototype');
const sandbox = new PrototypeSandbox(element, {
  autoStart: false,    // Don't auto-play
  showControls: true,  // Show reset/fullscreen buttons
  isolated: true,      // Prevent event bubbling
  theme: 'youtube',    // Visual theme
  aspectRatio: '16/9'  // Video aspect ratio
});

// Listen for events
element.addEventListener('prototypeStart', (e) => {
  console.log('Prototype started');
  // Initialize your prototype logic here
});

element.addEventListener('prototypeReset', (e) => {
  console.log('Prototype reset requested');
  // Reset your prototype state
  e.preventDefault(); // Prevent default reload behavior
});
```

### Integration with Existing Prototypes

Before:
```html
<div class="youtube-demo">
  <!-- Complex prototype code -->
</div>

<script>
// Prototype initialization code
</script>
```

After:
```html
<div data-prototype-sandbox='{"theme": "youtube"}'>
  <div class="youtube-demo">
    <!-- Same complex prototype code -->
  </div>
</div>

<script>
// Wait for sandbox to start
document.querySelector('[data-prototype-sandbox]')
  .addEventListener('prototypeStart', function() {
    // Original initialization code
  });
</script>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoStart` | boolean | `false` | Start immediately without play button |
| `showControls` | boolean | `true` | Show reset/fullscreen buttons |
| `isolated` | boolean | `true` | Prevent event propagation |
| `theme` | string | `'generic'` | Visual theme: 'youtube', 'soundcloud', 'generic' |
| `aspectRatio` | string | `'16/9'` | CSS aspect ratio for content |

## CSS Classes

- `.prototype-sandbox` - Main container
- `.prototype-sandbox.active` - When prototype is running
- `.prototype-sandbox.fullscreen` - Fullscreen mode
- `.prototype-sandbox.loading` - Loading state
- `.sandbox-content` - Scrollable content area
- `.sandbox-controls` - Control buttons container

## Best Practices

1. **Never auto-start prototypes** - Always require user interaction
2. **Keep prototypes lightweight** - Load assets on demand
3. **Provide clear visual feedback** - Show play button and loading states
4. **Test scroll containment** - Ensure scrolling doesn't leak to main page
5. **Add keyboard support** - Make prototypes accessible

## Migration Guide

To migrate existing YouTube prototype:

```javascript
// 1. Wrap in sandbox container
<div data-prototype-sandbox='{"theme": "youtube", "aspectRatio": "16/9"}'>
  <!-- Existing prototype HTML -->
</div>

// 2. Move initialization to start event
document.addEventListener('prototypeStart', function(e) {
  if (e.target.querySelector('.youtube-demo')) {
    // Existing initialization code
  }
});

// 3. Remove any auto-play logic
// 4. Remove custom scroll containment (sandbox handles it)
```