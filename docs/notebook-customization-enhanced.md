# Enhanced Notebook Customization Guide

This guide explains the hybrid approach to notebook customization: dynamic covers with CSS and static images for inside pages.

## Quick Overview

- **Notebook Covers**: Customizable via front matter (colors, textures, stickers, effects)
- **Inside Pages**: Custom images that you design (post-its, handwriting, photos, etc.)
- **Stickers**: Up to 4 stickers with custom positioning and shapes

## Inside Page Images

### Image Specifications

- **Dimensions**: 220px × 308px (or 440px × 616px for @2x retina)
- **Format**: JPEG for complex designs, PNG if you need transparency
- **File naming**: `notebook-pages.jpg` in your post folder
- **Quality**: 85-90% JPEG quality, keep under 100KB

### Design Safe Zones

```
Top:    35px (for potential elements)
Right:  20px (to show page edge)
Bottom: 30px 
Left:   20px (for binding realism)
```

### Usage in Front Matter

For a single image across both pages:
```yaml
---
title: My Project
notebook_pages: notebook-pages.jpg
---
```

For different images on left and right pages:
```yaml
---
title: My Project
notebook_page_left: left-page.jpg
notebook_page_right: right-page.jpg
---
```

You can also use just one custom page:
```yaml
---
title: My Project
notebook_page_right: custom-page.jpg  # Right page only
---
```

## Enhanced Sticker System

You can now add up to 4 stickers with custom positioning:

### Basic Stickers Example

```yaml
notebook_stickers:
  - text: "SHIPPED"
    bg: "#00c853"
    color: "#fff"
  - text: "2024"
    bg: "#ffeb3b"
    color: "#000"
  - text: "AI"
    bg: "#2196f3"
    color: "#fff"
    shape: "rounded"
  - text: "★"
    bg: "#9c27b0"
    color: "#fff"
    shape: "circle"
```

### Advanced Sticker Positioning

```yaml
notebook_stickers:
  - text: "BETA"
    bg: "#ff5722"
    rotate: "-15deg"
    top: "20px"
    left: "25px"
  - text: "CONFIDENTIAL"
    bg: "#f44336"
    rotate: "90deg"
    top: "50%"
    right: "5px"
  - text: "v2.0"
    shape: "rounded"
    bottom: "60px"
    left: "50%"
  - text: "!"
    shape: "circle"
    bg: "#ffc107"
    color: "#000"
    top: "30px"
    right: "40px"
    rotate: "25deg"
```

### Sticker Properties

- **text**: The sticker text (required)
- **bg**: Background color (default varies by position)
- **color**: Text color (default: #fff or #000)
- **rotate**: Rotation angle (default: -5deg to 8deg)
- **shape**: "rectangle", "rounded", or "circle"
- **top/right/bottom/left**: Custom positioning

## Complete Example

```yaml
---
title: AI Assistant Platform
display_name: "Universal Intelligence Layer"
company: Autodesk
notebook_color: crimson
notebook_texture: worn
notebook_brand: leuchtturm
notebook_effect: metallic
notebook_pages: custom-notebook-pages.jpg
notebook_stickers:
  - text: "AI/ML"
    bg: "#1976d2"
    rotate: "-8deg"
  - text: "PATENTED"
    bg: "#d32f2f"
    color: "#fff"
    shape: "rounded"
    bottom: "50px"
  - text: "2024"
    bg: "#fdd835"
    color: "#000"
    left: "50%"
    top: "70%"
  - text: "⚡"
    shape: "circle"
    bg: "#7b1fa2"
---
```

## Design Tips for Inside Pages

1. **Layer Elements**: 
   - Background: Subtle paper texture (#fffef8)
   - Post-its: Various angles (-5° to 10°)
   - Photos: Use drop shadows
   - Handwriting: Fonts like Kalam, Caveat

2. **Realistic Details**:
   - Coffee stains
   - Paper clips
   - Tape pieces
   - Folded corners
   - Sketches and diagrams

3. **Maintain Hierarchy**:
   - Most important info in center
   - Supporting details around edges
   - Use color sparingly for emphasis

## CSS Classes for Special Effects

The notebook system automatically applies these based on front matter:

- `data-notebook-color`: Base notebook color
- `data-notebook-texture`: Overlay texture effect
- `data-notebook-brand`: Brand text on cover
- `data-notebook-effect`: Special effects (holographic, metallic)
- `data-notebook-stickers`: Enables sticker system

## Performance Considerations

- Keep inside page images under 100KB
- Use JPEG for photos, PNG only when needed
- Consider creating a @2x version for retina displays
- Images are lazy-loaded automatically

## Technical Implementation Details

### Sticker Bleed-Through Fix
The system includes a `front-cover-backing` layer that sits just behind the front cover with the same color but without transparency. This prevents stickers from being visible through the back of the cover when the notebook is closed.

### Dual Page Support
You can specify different images for the left page (inside front cover) and right page (inside pages):
- `notebook_page_left`: Appears on the left when notebook opens
- `notebook_page_right`: Appears on the right page
- `notebook_pages`: Sets the same image for the right page (backward compatible)

### Image Priority
1. If `notebook_page_right` is specified, it takes priority over `notebook_pages`
2. If only `notebook_pages` is specified, it appears on the right page
3. Left page is blank unless `notebook_page_left` is specified
4. Fallback to paperclip photo if no custom images are provided