# Custom Cursors for Blog Prototypes

This guide explains how to apply custom cursors to inline blog prototypes, matching the design language of portfolio demos.

## Quick Start

### Method 1: Direct SVG Data URL (Current YouTube Example)

```html
<div class="youtube-demo" style="cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><circle cx="18" cy="6" r="2.5" fill="%23007AFF" stroke="white" stroke-width="1"/><line x1="16" y1="8" x2="14" y2="10" stroke="%23007AFF" stroke-width="1.5" stroke-linecap="round"/></svg>') 4 4, pointer;">
  <!-- Prototype content -->
</div>

<style>
/* Make all child elements inherit the cursor */
.youtube-demo * {
  cursor: inherit !important;
}
</style>
```

### Method 2: Using the Prototype Wrapper Tag (Recommended)

```markdown
{% prototype_wrapper cursor="interactive" theme="youtube" %}
<!-- Your prototype HTML goes here -->
<div class="my-prototype">
  ...
</div>
{% endprototype_wrapper %}
```

### Method 3: Simple Prototype Tag

```markdown
{% prototype "interactive" %}
<!-- Quick prototype with interactive cursor -->
<div class="demo">...</div>
{% endprototype %}
```

## Available Cursor Types

### 1. Interactive (Default)
- **Use for**: General interactive prototypes, clickable demos
- **Style**: White arrow with blue accent dot
- **Code**: `cursor="interactive"`

### 2. Design System
- **Use for**: Design tool prototypes, component libraries
- **Style**: White arrow with pink square indicator
- **Code**: `cursor="design"`

### 3. Enterprise
- **Use for**: Business/enterprise app prototypes
- **Style**: White arrow with blue corner bracket
- **Code**: `cursor="enterprise"`

### 4. Standard CSS Cursors
- `pointer` - Standard pointing hand
- `crosshair` - Precision selection
- `grab` - Draggable elements
- `help` - Help/info areas
- `text` - Text selection areas

## Custom Cursor SVG Format

Create your own cursor SVG:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Main cursor arrow (required) -->
  <path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
  
  <!-- Your custom accent (optional) -->
  <circle cx="18" cy="6" r="2.5" fill="#007AFF" stroke="white" stroke-width="1"/>
</svg>
```

### SVG Requirements
- Size: 24x24 viewport (can be scaled)
- Colors: Use `%23` instead of `#` in data URLs
- Hotspot: Set to `4 4` (top-left of arrow)
- Fallback: Always include a CSS fallback cursor

## Implementation Details

### CSS Inheritance
Always add this CSS to ensure all child elements use the custom cursor:

```css
.your-prototype * {
  cursor: inherit !important;
}
```

### Data URL Encoding
When using inline SVG data URLs:
- Replace `#` with `%23`
- Keep the SVG on one line
- Use single quotes for the URL
- Include the hotspot coordinates: `4 4`

### Browser Compatibility
- Modern browsers: Full support
- Safari: May need `-webkit-` prefix for some effects
- Fallback: Always include a standard cursor after the custom one

## Examples

### YouTube Timecode Commentary
```html
<div class="youtube-demo" style="cursor: url('data:image/svg+xml;utf8,...') 4 4, pointer;">
```

### Design Tool Prototype
```markdown
{% prototype_wrapper cursor="design" theme="default" %}
<div class="figma-prototype">
  <!-- Figma-like interface -->
</div>
{% endprototype_wrapper %}
```

### Enterprise Dashboard
```markdown
{% prototype_wrapper cursor="enterprise" theme="default" background="false" %}
<div class="dashboard-prototype">
  <!-- Enterprise app UI -->
</div>
{% endprototype_wrapper %}
```

## Best Practices

1. **Match cursor to content**: Use design cursor for design tools, enterprise for business apps
2. **Test on all browsers**: Ensure fallback cursors work properly
3. **Keep SVGs simple**: Complex SVGs may not render well at small sizes
4. **Consider accessibility**: Some users disable custom cursors
5. **Performance**: Use data URLs for small SVGs, external files for complex ones

## Troubleshooting

### Cursor not showing
- Check SVG syntax and encoding
- Ensure `cursor: inherit !important` is applied to child elements
- Verify fallback cursor is specified

### Cursor appears pixelated
- Increase SVG viewport size
- Use vector shapes instead of raster images
- Check browser zoom level

### Cursor hotspot is off
- Adjust the coordinates after the URL (default: `4 4`)
- Test with different hotspot values

## Migration Guide

To add custom cursor to existing prototypes:

1. Add cursor style to main container
2. Add CSS rule for cursor inheritance
3. Test all interactive elements
4. Verify cursor changes appropriately (e.g., text cursor in input fields)