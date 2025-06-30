# Custom Cursor System Documentation

This guide provides comprehensive documentation for the custom cursor system used in portfolio demos and blog prototypes. The cursor system enhances user experience by providing visual feedback that matches the design language of each demo.

## System Overview

### Architecture

The cursor system consists of three main components:

1. **Central Cursor CSS File**: `/demos/shared/styles/demo-cursors.css`
   - Defines all cursor styles as CSS custom properties
   - Uses base64-encoded SVG cursors for reliability
   - Imported by all demos for consistency

2. **Demo Integration**: Each demo imports the cursor CSS
   - `@import '@portfolio/demo-shared/styles/demo-cursors.css';`
   - Cursors automatically apply to all elements within demos
   - No additional configuration needed

3. **Blog Prototype Cursors**: For inline blog prototypes
   - Use direct SVG data URLs in style attributes
   - Apply cursor inheritance for child elements
   - Support for custom cursor designs

### How It Works

1. **CSS Variables**: Cursors are defined as CSS custom properties in `:root`
2. **Base64 Encoding**: SVG cursors are encoded to avoid file serving issues
3. **Universal Application**: `* { cursor: var(--cursor-default) !important; }`
4. **Context-Specific**: Different cursors for buttons, text, disabled states, etc.
5. **Iframe Isolation**: CSS doesn't cascade into iframes, so demos import their own styles

## Quick Start for Demos

### For New Demos

1. Import the cursor CSS in your demo's main CSS file:

```css
/* In src/App.css or similar */
@import '@portfolio/demo-shared/styles/demo-cursors.css';
```

2. That's it! Custom cursors will automatically apply to all elements.

### For Existing Demos

To add custom cursors to an existing demo:

```bash
# 1. Ensure you have the shared package
cd demos/your-demo
npm install @portfolio/demo-shared

# 2. Import the cursor CSS
echo "@import '@portfolio/demo-shared/styles/demo-cursors.css';" >> src/App.css

# 3. Rebuild the demo
npm run build
```

## Quick Start for Blog Prototypes

### Method 1: Direct SVG Data URL

```html
<div class="youtube-demo" style="cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>') 4 4, pointer;">
  <!-- Prototype content -->
</div>

<style>
/* Make all child elements inherit the cursor */
.youtube-demo * {
  cursor: inherit !important;
}
</style>
```

### Method 2: Using CSS Classes (Future Enhancement)

```html
<div class="prototype-wrapper cursor-interactive">
  <!-- Your prototype content -->
</div>
```

## Available Cursor Types

### Primary Cursors

#### 1. Default Cursor (`--cursor-default`)
- **Appearance**: White arrow with black outline
- **Use**: General navigation, non-interactive areas
- **Applied to**: All elements by default

#### 2. Pointer Cursor (`--cursor-pointer`)
- **Appearance**: White arrow with blue dot indicator
- **Use**: Clickable elements, links, buttons
- **Applied to**: `a`, `button`, `[role="button"]`, etc.

#### 3. Active/Pressed State (`--cursor-active`)
- **Appearance**: White arrow with larger blue dot
- **Use**: Active/pressed state of interactive elements
- **Applied to**: `:active` pseudo-state

### Functional Cursors

#### 4. Text Cursor (`--cursor-text`)
- **Appearance**: Standard text I-beam
- **Use**: Text input areas
- **Applied to**: `input[type="text"]`, `textarea`, `[contenteditable]`

#### 5. Disabled Cursor (`--cursor-disabled`)
- **Appearance**: Circle with diagonal line (prohibition sign)
- **Use**: Disabled interactive elements
- **Applied to**: `[disabled]`, `.disabled`, `[aria-disabled="true"]`

#### 6. Loading Cursor (`--cursor-loading`)
- **Appearance**: Circular progress indicator
- **Use**: Loading states
- **Applied to**: `.loading`, `.is-loading`, `[aria-busy="true"]`

#### 7. Grab/Grabbing Cursors
- **Grab**: Open hand with directional arrows
- **Grabbing**: Closed hand appearance
- **Use**: Draggable elements
- **Applied to**: `[draggable="true"]`, `.draggable`

#### 8. Help Cursor
- **Appearance**: Standard help cursor
- **Use**: Elements with additional information
- **Applied to**: `abbr[title]`, `.tooltip-trigger`

## Creating Custom Cursors

### Step 1: Design Your Cursor SVG

Create a 24x24 SVG with your cursor design:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Main cursor arrow (from default-cursor.svg) -->
  <path d="M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
  
  <!-- Your custom accent (optional) -->
  <circle cx="18" cy="6" r="3" fill="#007AFF" stroke="white"/>
</svg>
```

### Step 2: Convert to Base64

1. **Online Tool**: Use a base64 encoder (e.g., base64encode.org)
2. **Command Line**: 
   ```bash
   base64 -i cursor.svg | tr -d '\n'
   ```
3. **Node.js**:
   ```javascript
   const fs = require('fs');
   const svg = fs.readFileSync('cursor.svg', 'utf8');
   const base64 = Buffer.from(svg).toString('base64');
   console.log(base64);
   ```

### Step 3: Update the CSS

Edit `/demos/shared/styles/demo-cursors.css`:

```css
:root {
  /* Your new cursor */
  --cursor-custom: url('data:image/svg+xml;base64,YOUR_BASE64_STRING') 4 4, default;
}
```

### Step 4: Apply to Elements

```css
/* Apply to specific elements */
.special-element {
  cursor: var(--cursor-custom) !important;
}
```

### SVG Design Guidelines

1. **Size**: Keep viewBox at 24x24 for consistency
2. **Colors**: 
   - White fill with black stroke for visibility
   - Use accent colors sparingly (blue, green, red)
3. **Hotspot**: Default is `4 4` (top-left of arrow tip)
4. **Stroke**: 1.5px width for crisp rendering
5. **Complexity**: Keep simple - complex SVGs may not render well

## Technical Implementation

### File Structure

```
demos/
├── shared/
│   ├── styles/
│   │   └── demo-cursors.css    # Central cursor definitions
│   └── package.json             # Exports cursor CSS
└── [demo-name]/
    └── src/
        └── App.css              # Imports cursor CSS

themes/san-diego/
├── source/
│   ├── components/
│   │   └── prototype-sandbox/
│   │       └── cursors/
│   │           └── default-cursor.svg  # Source SVG
│   └── styles/
│       └── _demo-cursors.scss  # Documentation only
```

### CSS Architecture

1. **CSS Custom Properties**: All cursors defined as variables
2. **Universal Selector**: `* { cursor: var(--cursor-default) !important; }`
3. **Specific Overrides**: Interactive elements get appropriate cursors
4. **Important Flag**: Ensures cursor consistency across all elements

### Base64 Encoding Process

1. **Why Base64?**: Avoids Hexo's JSON wrapping of SVG files
2. **Encoding**: SVG → Base64 → Data URL
3. **Format**: `url('data:image/svg+xml;base64,BASE64_STRING') X Y, fallback`
4. **Hotspot**: `X Y` coordinates (usually `4 4` for arrow tip)

### Browser Considerations

1. **Maximum Size**: 128x128 pixels (browser limitation)
2. **Format Support**: SVG universally supported in modern browsers
3. **Fallback Cursors**: Always include (e.g., `default`, `pointer`)
4. **Performance**: Base64 adds ~33% size but eliminates HTTP requests

## Implementation Examples

### Portfolio Demo Integration

```jsx
// In any demo's App.jsx or main CSS
import '@portfolio/demo-shared/styles/demo-cursors.css';

function App() {
  return (
    <div className="demo-container">
      {/* Cursors automatically applied */}
      <button>Has pointer cursor</button>
      <input type="text" /> {/* Has text cursor */}
      <div className="loading">Has loading cursor</div>
    </div>
  );
}
```

### Blog Prototype with Custom Cursor

```html
<!-- YouTube Timecode Commentary Example -->
<div class="youtube-demo" style="cursor: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>') 4 4, pointer;">
  <div class="video-player">
    <!-- Video content -->
  </div>
  <div class="comments-section">
    <!-- Comments -->
  </div>
</div>

<style>
/* Critical: Ensure all children inherit the cursor */
.youtube-demo * {
  cursor: inherit !important;
}

/* Override for text areas */
.youtube-demo input,
.youtube-demo textarea {
  cursor: text !important;
}
</style>
```

### Advanced Demo with State-Based Cursors

```css
/* In your demo CSS after importing demo-cursors.css */

/* Draggable component */
.draggable-card {
  cursor: var(--cursor-grab) !important;
}

.draggable-card.is-dragging {
  cursor: var(--cursor-grabbing) !important;
}

/* Loading overlay */
.demo-overlay.is-loading {
  cursor: var(--cursor-loading) !important;
}

/* Disabled state */
.demo-button:disabled {
  cursor: var(--cursor-disabled) !important;
  opacity: 0.6;
}
```

## Best Practices

### Design Principles

1. **Consistency**: Use the same cursor system across all demos
2. **Context**: Match cursor style to demo purpose
3. **Feedback**: Provide visual feedback for different states
4. **Simplicity**: Keep cursor designs simple and recognizable

### Performance Guidelines

1. **File Size**: Keep SVG cursors under 2KB
2. **Base64**: Ideal for cursors (small files, eliminates requests)
3. **Caching**: Base64 cursors cached with CSS
4. **GPU**: Simple SVGs render efficiently

### Accessibility Considerations

1. **System Preferences**: Some users disable custom cursors
2. **Fallbacks**: Always include standard cursor fallbacks
3. **Contrast**: Ensure cursor visible on all backgrounds
4. **Size**: Keep cursors appropriately sized (24x24 standard)

### Development Workflow

1. **Design**: Create cursor in vector editor (Figma, Sketch)
2. **Export**: Save as SVG with 24x24 viewBox
3. **Optimize**: Remove unnecessary attributes
4. **Encode**: Convert to base64
5. **Test**: Verify in all target browsers
6. **Deploy**: Update `demo-cursors.css`

## Troubleshooting

### Common Issues

#### Cursor Not Showing

1. **Check Import**: Ensure `@import '@portfolio/demo-shared/styles/demo-cursors.css';`
2. **Build Issues**: Rebuild demo after adding import
3. **Path Issues**: Verify `@portfolio/demo-shared` is in package.json
4. **Browser Cache**: Clear cache or hard refresh
5. **SVG Syntax**: Validate SVG if using custom cursor

#### Cursor Inheritance Problems

```css
/* Solution 1: Ensure child inheritance */
.container * {
  cursor: inherit !important;
}

/* Solution 2: More specific selectors */
.container button,
.container a,
.container [role="button"] {
  cursor: var(--cursor-pointer) !important;
}
```

#### Cursor Appears Blocky/Pixelated

1. **SVG Quality**: Use vector paths, not embedded images
2. **Viewport**: Maintain 24x24 viewBox
3. **Zoom**: Test at different browser zoom levels
4. **Display**: Check on high-DPI displays

#### Wrong Cursor on Specific Elements

1. **Specificity**: Use `!important` flag
2. **Order**: Check CSS load order
3. **Overrides**: Look for conflicting styles
4. **JavaScript**: Check if JS is modifying cursor

### Debugging Steps

1. **Inspect Element**: Check computed styles for cursor property
2. **Console Check**: Look for CSS loading errors
3. **Network Tab**: Verify cursor CSS file loaded
4. **Base64 Validation**: Test data URL in isolation
5. **Cross-Browser**: Test in multiple browsers

## Migration Guide

### For Existing Demos

#### Step 1: Add Dependency

```bash
cd demos/your-demo
npm install @portfolio/demo-shared
```

#### Step 2: Import Cursor CSS

Add to your main CSS file (e.g., `src/App.css`):

```css
@import '@portfolio/demo-shared/styles/demo-cursors.css';
```

#### Step 3: Remove Old Cursor Styles

Remove any existing cursor definitions:

```css
/* Remove these: */
.demo { cursor: pointer; }
button { cursor: hand; }

/* The import handles everything */
```

#### Step 4: Test and Build

```bash
npm run dev  # Test locally
npm run build  # Build for production
```

### For Blog Prototypes

1. **Identify Prototype Container**: Find the main wrapper div
2. **Add Cursor Style**: Use inline style with data URL
3. **Add Inheritance CSS**: Ensure children inherit cursor
4. **Test Interactions**: Verify all elements have appropriate cursors

### Cleanup Checklist

- [ ] Remove old cursor image files
- [ ] Delete unused cursor CSS/SCSS files  
- [ ] Update any JavaScript cursor logic
- [ ] Test all interactive states
- [ ] Verify in all target browsers

## Maintenance

### Updating Cursors

1. **Design New Cursor**: Create/modify SVG
2. **Convert to Base64**: Use encoding tool
3. **Update CSS**: Edit `/demos/shared/styles/demo-cursors.css`
4. **Test in Demo**: Verify appearance
5. **Deploy**: Commit and push changes

### Adding New Cursor Types

```css
/* In demo-cursors.css */
:root {
  /* Existing cursors... */
  
  /* New cursor type */
  --cursor-resize: url('data:image/svg+xml;base64,...') 12 12, nw-resize;
}

/* Apply to elements */
.resize-handle {
  cursor: var(--cursor-resize) !important;
}
```

### Version Control

- Keep source SVGs in `/themes/san-diego/source/components/prototype-sandbox/cursors/`
- Document cursor changes in commit messages
- Test thoroughly before deploying