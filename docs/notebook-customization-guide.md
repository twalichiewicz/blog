# Notebook Customization Guide

This guide explains how to customize the appearance of portfolio notebook covers using the notebook customization framework.

## Overview

Each portfolio project can have a unique notebook appearance by setting various front matter properties in the markdown file. The customization options include:

1. **Color** - The base color of the notebook cover
2. **Texture** - Overlay effects like worn, scratched, or weathered
3. **Brand** - The manufacturer text shown at the bottom
4. **Effects** - Special visual effects like holographic or metallic
5. **Stickers** - Custom stickers/labels on the cover

## Basic Usage

Add these properties to your portfolio post's front matter:

```yaml
---
title: My Project
notebook_color: navy
notebook_texture: worn
notebook_brand: leuchtturm
---
```

## Available Options

### Colors

Classic colors:
- `black` - Default charcoal black
- `charcoal` - Darker black
- `navy` - Deep blue
- `emerald` - Forest green
- `berry` - Deep burgundy
- `sage` - Muted green
- `ochre` - Golden yellow
- `rust` - Burnt orange

Modern colors:
- `nordic-blue` - Scandinavian blue-grey
- `forest` - Deep forest green
- `copper` - Metallic copper
- `wine` - Wine red
- `slate` - Blue-grey
- `olive` - Olive green
- `plum` - Deep purple
- `tobacco` - Brown leather

Special editions:
- `gold` - Metallic gold gradient
- `silver` - Metallic silver gradient
- `rose-gold` - Rose gold gradient

### Textures

- `pristine` - Clean, new notebook (default)
- `worn` - Subtle wear patterns
- `scratched` - Light scratch marks
- `weathered` - Age spots and weathering
- `stained` - Coffee/tea stains

### Brands

- `leuchtturm` - LEUCHTTURM1917 (default)
- `moleskine` - MOLESKINE
- `field-notes` - FIELD NOTES
- `rhodia` - Rhodia
- `custom` - Use with `notebook_brand_text`

For custom brand text:
```yaml
notebook_brand: custom
notebook_brand_text: "THOMAS.DESIGN"
```

### Effects

- `holographic` - Animated holographic shimmer
- `metallic` - Metallic sheen effect

### Stickers

Add up to 2 stickers to the notebook cover:

```yaml
notebook_stickers:
  - text: "TOP SECRET"
    color: "#fff"
    bg: "#ff0000"
    rotate: "-5deg"
  - text: "v2.0"
    color: "#000"
    bg: "#ffeb3b"
    rotate: "3deg"
```

## Complete Example

```yaml
---
title: Design System Project
featured: true
notebook_color: nordic-blue
notebook_texture: worn
notebook_brand: leuchtturm
notebook_effect: metallic
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-3deg"
  - text: "2024"
    color: "#000"
    bg: "#ffd600"
    rotate: "2deg"
---
```

## Preset Combinations

You can also use CSS utility classes for common combinations:

- `.notebook-vintage` - Tobacco color, weathered texture, Moleskine brand
- `.notebook-tech` - Nordic blue, pristine, Leuchtturm, metallic effect
- `.notebook-creative` - Berry color, worn texture, Rhodia brand

## Tips

1. **Color Selection**: Choose colors that reflect the project's nature:
   - Tech projects: `nordic-blue`, `slate`, `charcoal`
   - Creative projects: `berry`, `plum`, `copper`
   - Professional: `navy`, `forest`, `wine`

2. **Texture Matching**: 
   - New projects: `pristine`
   - Long-term projects: `worn` or `weathered`
   - Experimental: `scratched`

3. **Stickers**: Use sparingly for special achievements:
   - Launch status: "SHIPPED", "BETA", "LIVE"
   - Awards: "WINNER", "FEATURED"
   - Version: "v1.0", "2024"

4. **Brand Alignment**: Match the notebook brand to the project style:
   - Minimalist: `moleskine`
   - Professional: `leuchtturm`
   - Creative: `rhodia`
   - Startup: `field-notes`

## Implementation Notes

The customization system uses CSS custom properties and data attributes. All styling is handled through `_notebook-customization.scss`. The system is designed to be extensible - new colors, textures, and effects can be added to the SCSS maps.