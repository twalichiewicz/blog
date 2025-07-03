# Notebook System Documentation

Complete technical documentation for the portfolio notebook animation and customization system.

## Table of Contents
1. [Overview](#overview)
2. [Notebook Attributes](#notebook-attributes)
3. [Notebook Variants](#notebook-variants)
4. [Animation System](#animation-system)
5. [Customization Options](#customization-options)
6. [Technical Implementation](#technical-implementation)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting](#troubleshooting)

## Overview

The notebook system is a sophisticated 3D animated portfolio presentation system that transforms project previews into interactive notebooks. Each portfolio item can be customized with different colors, textures, brands, effects, and stickers.

### Key Features
- **3D Page-Turning Animation**: Desktop hover and mobile scroll-triggered opening
- **Extensive Customization**: 22+ colors, 5 textures, 4 brands, 2 effects
- **Sticker System**: Up to 4 customizable stickers per notebook
- **Multiple Variants**: 4 different notebook styles
- **Responsive Design**: Optimized animations for desktop and mobile

## Notebook Attributes

Configure notebooks through front matter in portfolio posts:

```yaml
# Color and appearance
notebook_color: "nordic-blue"           # Color preset or gradient
notebook_texture: "worn"                # Texture overlay
notebook_effect: "metallic"             # Special visual effects

# Branding
notebook_brand: "leuchtturm"            # Brand logo
notebook_brand_text: "CUSTOM TEXT"      # Custom text (only with brand: "custom")

# Structure
notebook_style: "leuchtturm"            # Notebook type/variant

# Content
notebook_pages: "image.jpg"             # Single page image
notebook_page_right: "right.jpg"        # Right page only
notebook_page_left: "left.jpg"          # Left page only

# Stickers (up to 4)
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-3deg"
    shape: "rectangle"
    style: "regular"      # regular or die-cut
    # Optional positioning
    top: "20px"
    right: "20px"
```

## Notebook Variants

### 1. Leuchtturm (Default)
- **Style**: `leuchtturm`
- **Description**: Classic hardcover notebook with elastic band
- **Animation**: 3D page-turning with layered rotation
- **Best for**: Professional projects, case studies

### 2. Spiral Notebook
- **Style**: `spiral`
- **Description**: Side-bound spiral notebook
- **Animation**: Same as leuchtturm with metallic spiral binding
- **Best for**: Sketches, wireframes, process work

### 3. Notepad
- **Style**: `notepad`
- **Description**: Top-flip notepad in portrait orientation
- **Animation**: Flips up instead of sideways
- **Best for**: Quick notes, brainstorming content

### 4. Paper Stack
- **Style**: `stack-papers`
- **Description**: Loose paper stack with metallic staple
- **Animation**: Page curl effect (different from notebook opening)
- **Best for**: Documents, reports, research

## Animation System

### Desktop Hover Animation
- **Trigger**: CSS `:hover` on `.portfolio-item-wrapper`
- **Duration**: 1.8s
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Delays**: 
  - Front cover: 50ms
  - Inside cover: 50ms  
  - Inner page: 100ms

```scss
&:hover .notebook {
    transform: scale(0.9) translateX(15%);
    
    .front-cover {
        transform: translateZ(5px) rotateY(-150deg);
        transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.05s;
    }
}
```

### Mobile Scroll Animation
- **Trigger**: JavaScript `IntersectionObserver` when notebook centers in viewport
- **Duration**: 1.8s (same as desktop)
- **Scale**: 0.85 (vs 0.9 desktop)
- **Auto-centering**: Smooth scroll to center when stationary

```javascript
// Observer watches center third of viewport
const options = {
    root: this.projectsContent,
    rootMargin: '-33.33% 0px -33.33% 0px',
    threshold: 0.5
};
```

### Animation Layers (Back to Front)
1. **Back Cover** (static anchor)
2. **Inside Back Cover**
3. **Inner Page Right** (custom content)
4. **Inner Page Left** (optional)
5. **Inside Front Cover** (rotates -150°)
6. **Front Cover** (rotates -150°, contains brand/stickers)

## Customization Options

### Colors (22 Options)

**Classic Colors:**
- `black` (#262626)
- `charcoal` (#1a1a1a)  
- `navy` (#1e3a5f)
- `emerald` (#0d4f3c)
- `berry` (#5d1e3f)
- `crimson` (#dc143c)
- `sage` (#4a5445)
- `ochre` (#8b6914)
- `rust` (#8b3a1f)

**Modern Colors:**
- `nordic-blue` (#2e5266)
- `forest` (#1b3b36)
- `copper` (#b87333)
- `wine` (#722f37)
- `slate` (#434c5e)
- `olive` (#3d4f2f)
- `plum` (#4b294b)
- `tobacco` (#6f4e37)
- `warm-grey` (#f5f5f0)
- `offwhite` (#fafaf8)
- `dark-lime-green` (#556b2f)
- `tangerine` (#ff6347)

**Gradient Effects:**
- `gold` - Metallic gold gradient
- `silver` - Metallic silver gradient  
- `rose-gold` - Rose gold gradient

### Textures (5 Options)
1. **`pristine`** - Clean, no texture overlay
2. **`worn`** - Subtle aging with turbulence filter
3. **`scratched`** - Diagonal scratch marks
4. **`weathered`** - Radial wear pattern
5. **`stained`** - Coffee/tea stain effects

### Brand Options (5 Options)
1. **`leuchtturm`** - "LEUCHTTURM1917" (default)
2. **`moleskine`** - "MOLESKINE"
3. **`field-notes`** - "FIELD NOTES"
4. **`rhodia`** - "RHODIA"
5. **`custom`** - Uses `notebook_brand_text` value

### Effects (2 Options)
1. **`holographic`** - Animated rainbow color shift (3s infinite)
2. **`metallic`** - Static metallic sheen with highlights

### Sticker System

**Sticker Properties:**
```yaml
notebook_stickers:
  - text: "REQUIRED_TEXT"          # Text content (required)
    color: "#ffffff"               # Text color (optional)
    bg: "#007AFF"                  # Background color (optional)
    rotate: "-5deg"                # Rotation angle (optional)
    shape: "rectangle"             # Shape: rectangle, rounded, circle, badge (optional)
    style: "regular"               # Style: regular, die-cut (optional, default: regular)
    # Manual positioning (optional)
    top: "20px"
    right: "30px"
    bottom: "auto"
    left: "auto"
```

**Default Sticker Positions:**
- **Sticker 1**: Top right, -5° rotation, rectangle
- **Sticker 2**: Bottom left, 3° rotation, rectangle  
- **Sticker 3**: Center, -2° rotation, rounded
- **Sticker 4**: Bottom right, 8° rotation, circle

**Example Configurations:**

*Mixed Sticker Styles:*
```yaml
notebook_stickers:
  - text: "SHIPPED"
    color: "#fff"
    bg: "#00c853"
    rotate: "-5deg"
    style: "regular"      # Traditional sticker look
    
  - text: "v2.0"
    color: "#000"
    bg: "#ffd600"
    rotate: "3deg"
    style: "die-cut"      # Text-hugging style
    
  - text: "BETA"
    color: "#fff"
    bg: "#ff5722"
    shape: "badge"
    style: "die-cut"      # Badge shape only works with die-cut
    
  - text: "⭐"
    color: "#ffd600"
    bg: "#000"
    shape: "circle"
    style: "regular"      # Good for emoji/icons
```

*Tech Stack Example:*
```yaml
notebook_stickers:
  - text: "REACT"
    style: "die-cut"
    bg: "#61dafb"
    color: "#000"
    
  - text: "AI/ML"
    style: "die-cut"
    bg: "#1a237e"
    color: "#fff"
```

**Sticker Styles:**

*Regular Style (default):*
- 3px white border with pronounced shadows
- Uppercase text transformation
- Bold font weight (700)
- 11px font size, 6px×14px padding
- Traditional sticker appearance

*Die-Cut Style:*
- 2px white border with subtle shadows
- Tighter text-hugging design
- Extra bold font weight (900)
- 13px font size, 3px×8px padding
- Authentic die-cut appearance
- Special "badge" shape option available

## Technical Implementation

### File Structure
```
themes/san-diego/source/styles/
├── _leuchtturm-notebook.scss        # Main animation system
├── _notebook-customization.scss     # Colors, textures, effects, stickers
├── _notebook-variants.scss          # Different notebook styles
└── _notebook-skeleton.scss          # Loading states

themes/san-diego/source/js/
├── portfolio-notebook-carousel-final.js  # Mobile carousel
├── notebook-skeleton-loader.js           # Loading management
└── main.js                               # Sound effects
```

### CSS Architecture

**Animation Structure:**
```scss
.portfolio-item-wrapper {
    cursor: pointer; // Interactive cursor
    
    @media (hover: hover) and (pointer: fine) {
        &:hover .notebook {
            transform: scale(0.9) translateX(15%);
            
            .front-cover {
                transform: translateZ(5px) rotateY(-150deg);
                transition: transform 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.05s;
            }
        }
    }
}
```

**Mobile Carousel:**
```scss
@media (max-width: 768px) {
    .notebook-carousel-mobile {
        .portfolio-item-wrapper {
            &.carousel-active {
                .notebook {
                    transform: scale(0.85) translateX(10%);
                }
            }
        }
    }
}
```

### JavaScript Components

**Mobile Carousel Manager:**
```javascript
class NotebookCarousel {
    constructor() {
        this.notebooks = Array.from(document.querySelectorAll('.portfolio-item-wrapper'));
        this.currentActiveIndex = -1;
        this.scrollEndDelay = 150; // ms
    }
    
    activateNotebook(index) {
        this.notebooks[index].classList.add('carousel-active');
        // Play sound effect after 300ms
        if (window.playBookSound) {
            setTimeout(() => window.playBookSound(), 300);
        }
    }
}
```

**Skeleton Loader:**
```javascript
class NotebookSkeletonLoader {
    checkImageLoad(img) {
        if (img.complete) {
            this.markNotebookLoaded(img);
        } else {
            img.addEventListener('load', () => this.markNotebookLoaded(img));
            img.addEventListener('error', () => this.markNotebookLoaded(img));
        }
    }
}
```

### DOM Structure
```html
<a class="portfolio-item-wrapper" 
   data-notebook-color="nordic-blue"
   data-notebook-texture="worn"
   data-notebook-brand="leuchtturm"
   data-notebook-effect="metallic">
   
   <div class="portfolio-item portfolio-item--featured">
       <!-- Skeleton loader -->
       <div class="notebook-skeleton">...</div>
       
       <div class="notebook">
           <!-- Layer structure (back to front) -->
           <div class="back-cover"></div>
           <div class="inside-back-cover"></div>
           <div class="inner-page-right">
               <!-- Custom notebook pages -->
           </div>
           <div class="inner-page-left">
               <!-- Optional left page -->
           </div>
           <div class="inside-front-cover"></div>
           <div class="front-cover">
               <!-- Brand text & stickers -->
               <div class="notebook-elastic"></div>
           </div>
       </div>
   </div>
</a>
```

## Performance Considerations

### Optimization Techniques
1. **GPU Acceleration**: `transform: translateZ(0)` and `will-change` hints
2. **Efficient Transitions**: Hardware-accelerated transform properties only
3. **Event Delegation**: Single scroll listener for all notebooks
4. **Intersection Observer**: Efficient viewport detection
5. **Skeleton Loading**: Prevents layout shift during image load

### Browser Support
- **Modern Browsers**: Full 3D transform support
- **Progressive Enhancement**: Fallbacks for older browsers
- **Mobile Optimization**: Touch-friendly interactions and simplified animations

### Performance Metrics
- **Animation Duration**: 1.8s (cinematic feel)
- **Response Time**: <150ms (UX guideline compliance)
- **Bundle Impact**: ~15KB CSS, ~8KB JavaScript
- **Memory Usage**: Minimal (no heavy assets)

## Troubleshooting

### Common Issues

**Notebook Not Animating:**
1. Check if `.portfolio-item-wrapper` has `cursor: pointer`
2. Verify hover media query: `@media (hover: hover) and (pointer: fine)`
3. Ensure transition delays are under 150ms

**Mobile Carousel Not Working:**
1. Confirm JavaScript file is loaded: `portfolio-notebook-carousel-final.js`
2. Check mobile detection: `window.innerWidth <= 768`
3. Verify scroll container: `#projectsContent.has-notebook-carousel`

**Stickers Not Appearing:**
1. Check sticker data attribute: `data-notebook-stickers="true"`
2. Verify sticker structure in front matter
3. Ensure CSS is compiled and loaded

**Custom Pages Not Loading:**
1. Check image paths in post folder
2. Verify skeleton loader is functioning
3. Confirm image optimization hasn't corrupted files

### Debug Tools

**Console Commands:**
```javascript
// Check carousel state
document.querySelector('.notebook-carousel-mobile')

// Test notebook activation
document.querySelector('.portfolio-item-wrapper').classList.add('carousel-active')

// Verify sticker data
document.querySelector('[data-notebook-stickers]').dataset
```

**CSS Debug Classes:**
```scss
// Show layer boundaries
.notebook * {
    outline: 1px solid rgba(255, 0, 0, 0.5);
}

// Force animation state
.notebook {
    transform: scale(0.9) translateX(15%) !important;
}
```

### Performance Debugging
1. **Chrome DevTools**: Monitor transform animations in Performance tab
2. **Rendering**: Check for unnecessary repaints/reflows
3. **Memory**: Watch for event listener leaks
4. **Network**: Verify optimized image delivery

---

*Last updated: December 2024*
*Maintained by: Thomas Walichiewicz*

**Recent Updates:**
- Added die-cut sticker style option for more authentic text-hugging appearance
- Added badge shape option for die-cut stickers
- Enhanced sticker documentation with style comparison and examples