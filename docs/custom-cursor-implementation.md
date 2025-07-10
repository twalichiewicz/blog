# Custom Cursor Implementation Guide

## Overview
This document describes the custom cursor system implemented for all demos and prototypes across the blog.

## Cursor Types Available

### 1. **Default Cursor** (`default.svg`)
- Used for: General non-interactive areas
- Applied to: Demo wrapper containers, backgrounds
- CSS: `cursor: url('/cursors/default.svg') 0 0, auto`

### 2. **Pointer Cursor** (`pointer.svg`)
- Used for: Clickable elements
- Applied to: Buttons, links, navigation controls, carousel indicators
- CSS: `cursor: url('/cursors/pointer.svg') 0 0, pointer`

### 3. **Text Cursor** (`text.svg`)
- Used for: Text input areas
- Applied to: Input fields, textareas, contenteditable elements
- CSS: `cursor: url('/cursors/text.svg') 0 0, text`

### 4. **Help Cursor** (`help.svg`)
- Used for: Elements with additional information
- Applied to: Elements with `[title]` attribute, help icons, abbreviations
- CSS: `cursor: url('/cursors/help.svg') 0 0, help`

### 5. **Grab/Grabbing Cursors** (`grab.svg`, `grabbing.svg`)
- Used for: Draggable elements
- Applied to: Progress bars, timeline scrubbers, draggable panels
- CSS: 
  ```scss
  cursor: url('/cursors/grab.svg') 12 12, grab;
  &:active {
    cursor: url('/cursors/grabbing.svg') 12 12, grabbing;
  }
  ```

### 6. **Move Cursor** (`move.svg`)
- Used for: Movable elements
- Applied to: Elements with `.movable` class
- CSS: `cursor: url('/cursors/move.svg') 12 12, move`

### 7. **Busy/Loading Cursors** (`busy.svg`, `background-busy.svg`)
- Used for: Loading states
- Applied to: Elements with `.loading`, `[aria-busy="true"]`, `.busy`
- CSS: `cursor: url('/cursors/busy.svg') 0 0, wait`

### 8. **Disabled Cursor** (`disabled.svg`)
- Used for: Disabled interactive elements
- Applied to: Disabled buttons, disabled inputs
- CSS: `cursor: url('/cursors/disabled.svg') 0 0, not-allowed`

### 9. **Resize Cursors** (`resize.svg`, `resize-alt.svg`)
- Used for: Resizable elements
- Applied to: Resize handles, resizable panels
- CSS: `cursor: url('/cursors/resize.svg') 12 12, nwse-resize`

### 10. **Zoom Cursors** (`zoom-in.svg`, `zoom-out.svg`)
- Used for: Zoomable content
- Applied to: Carousel images, spotlight modal
- CSS: 
  ```scss
  cursor: url('/cursors/zoom-in.svg') 12 12, zoom-in;
  &.zoomed {
    cursor: url('/cursors/zoom-out.svg') 12 12, zoom-out;
  }
  ```

## Implementation Details

### Base Styles
The cursor system is implemented in `/themes/san-diego/source/styles/_demo-cursors.scss`. It applies to:

- `.demo-inline-iframe`
- `.demo-inline-container`
- `.code-sandbox-wrapper .code-sandbox-content`
- `.youtube-demo`
- `.prototype-sandbox`
- `.advanced-prototype`

### Carousel-Specific Cursors
```scss
.carousel {
  .carousel-slide img {
    cursor: url('/cursors/zoom-in.svg') 12 12, zoom-in;
  }
  
  .carousel-button,
  .indicator {
    cursor: url('/cursors/pointer.svg') 0 0, pointer !important;
  }
}
```

### Spotlight Modal Cursors
```scss
.carousel-spotlight-modal {
  cursor: url('/cursors/default.svg') 0 0, auto;
  
  .spotlight-close,
  .spotlight-prev,
  .spotlight-next {
    cursor: url('/cursors/pointer.svg') 0 0, pointer !important;
  }
  
  .spotlight-media-container img {
    cursor: url('/cursors/zoom-out.svg') 12 12, zoom-out;
  }
}
```

## Demo-Specific Implementation

### React Demos (Iframe-based)
React demos must import the shared cursor CSS file:
```javascript
import '../../shared/components/custom-cursors.css';
```

Each demo must also have cursor files in its public directory for proper path resolution.

### Inline HTML Demos
Inline demos (like the YouTube demo) may have hardcoded cursor styles in the markdown. These should be updated to use the standard cursor paths: `/cursors/[cursor-name].svg`

## Testing Cursors

### Visual Testing
1. Hover over different elements to verify correct cursor
2. Check all interactive states (hover, active, disabled)
3. Test zoom functionality on carousel images
4. Verify loading states show busy cursor

### Browser DevTools
1. Check Network tab for 404s on cursor files
2. Inspect computed styles to verify cursor rules are applied
3. Use "Force element state" to test :hover and :active cursors

### Common Issues
- **Cursor not showing**: Check file paths and Network tab for 404s
- **Wrong cursor**: Check CSS specificity and cascade order
- **Iframe demos**: Ensure cursor CSS is imported inside the demo
- **Competing styles**: Look for hardcoded cursor styles or !important rules

## Maintenance

### Adding New Cursors
1. Add SVG file to `/themes/san-diego/source/cursors/`
2. Define CSS rules in `_demo-cursors.scss`
3. Copy cursor files to demo public directories if needed
4. Test across all demo types

### Updating Existing Cursors
1. Replace SVG file in `/themes/san-diego/source/cursors/`
2. Clear browser cache to see changes
3. Test all affected elements

### Debugging Steps
1. Check actual source code first (especially for inline demos)
2. Verify cursor file paths are correct
3. Check for competing cursor styles
4. Test in different browsers
5. Use browser DevTools to inspect computed styles