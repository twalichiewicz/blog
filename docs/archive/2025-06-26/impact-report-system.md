# Impact Report Tile System Documentation

## Overview

The Impact Report is a dynamic, animated dashboard that visualizes career achievements through an elegant tile-based interface. Built with responsive design principles, it adapts seamlessly from desktop to mobile while maintaining visual hierarchy and engagement.

## Architecture

### Core Components

#### 1. Modal Structure
```html
<div id="impact-modal" class="impact-modal">
    <div class="impact-modal-backdrop"></div>
    <div class="impact-modal-sheet">
        <div class="impact-modal-header">
            <!-- Header controls -->
        </div>
        <div class="impact-grid">
            <!-- Impact sections -->
        </div>
    </div>
</div>
```

#### 2. Grid System
The system uses a nested grid architecture:
- **Main Container**: Flexbox column layout for sections
- **Sections**: CSS Grid with 6 columns on desktop
- **Tiles**: Span across grid cells based on size

```scss
.impact-section {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: minmax(140px, 1fr);
    gap: 16px;
}
```

### Tile Sizes

| Size | Grid Span | Use Case | Example |
|------|-----------|----------|---------|
| Small | 1x1 | Single metrics | "85% Retention" |
| Medium | 2x1 | Charts with labels | Progress bars |
| Large | 3x2 | Featured metrics | "$30M+ Impact" |

### Responsive Behavior

#### Desktop (>1024px)
- 6-column grid
- Full animations and hover effects
- Detailed hover content

#### Tablet (768px - 1024px)
- 4-column grid
- Adjusted tile sizes
- Maintained proportions

#### Mobile (<768px)
- 2-column grid
- Fixed 60px height tiles
- Simplified layouts
- Hidden hover content

## Animation System

### Animation Types

| Type | Description | Use Case |
|------|-------------|----------|
| `counter` | Counts up from 0 to target | Numeric values |
| `scale` | Horizontal scaling effect | Progress bars |
| `wave` | Circular fill animation | Donut charts |
| `stack` | Staggered appearance | Layered items |
| `pulse` | Pulsing scale effect | Year rings |
| `grow` | Vertical growth | Bar charts |
| `extend` | Horizontal extension | Timeline bars |
| `race` | Speed comparison | Before/after |
| `spark` | Sparkle effect | Innovation items |
| `shine` | Shimmer animation | Awards |
| `rotate` | Continuous rotation | Global elements |
| `flip` | 3D flip effect | Reveal content |

### Implementation

```javascript
// Trigger animations on modal open
function initImpactGridAnimations() {
    const tiles = document.querySelectorAll('.impact-tile');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateTile(entry.target);
                }, index * 100); // Stagger by 100ms
            }
        });
    });
    tiles.forEach(tile => observer.observe(tile));
}
```

## Color System

### Accent Colors
Each metric category has a unique glowing accent color:

```scss
// Financial metrics
.tile-revenue { --accent-color: #7DFFB3; }     // Mint
.tile-savings { --accent-color: #80FFE5; }     // Teal

// Efficiency metrics  
.tile-efficiency { --accent-color: #FFB380; }  // Peach
.tile-support { --accent-color: #FF7D7D; }     // Coral

// Scale metrics
.tile-adoption { --accent-color: #B3BBFF; }    // Periwinkle
.tile-teams { --accent-color: #CC99FF; }       // Lavender

// Impact metrics
.tile-satisfaction { --accent-color: #80E5FF; } // Cyan
.tile-legacy { --accent-color: #FFD700; }      // Gold
```

### Visual Effects
```scss
.tile-value {
    color: white;
    text-shadow: 0 0 20px var(--accent-color),
                 0 0 40px var(--accent-color);
}
```

## Text Fitting System

Dynamic text sizing ensures optimal readability:

```javascript
function fitTextToContainer(textElement, container, heightRatio) {
    // Binary search for optimal font size
    let low = minFontSize;
    let high = maxFontSize;
    
    while (high - low > 0.5) {
        const mid = (low + high) / 2;
        textElement.style.fontSize = mid + 'px';
        
        if (fitsInContainer()) {
            low = mid;
        } else {
            high = mid;
        }
    }
}
```

## Creating New Tiles

### Basic Tile Structure
```html
<div class="impact-tile tile-[size] tile-[category]" 
     data-animate="[animation-type]">
    <div class="tile-inner">
        <div class="tile-mobile-wrapper">
            <div class="tile-mobile-content">
                <div class="tile-value">100</div>
                <div class="tile-label">Metric Name</div>
            </div>
        </div>
        <div class="tile-detail">Additional context</div>
    </div>
</div>
```

### Adding Custom Animations
```javascript
// In main.js
function animateCustom(tile) {
    const element = tile.querySelector('.custom-element');
    // Custom animation logic
}

// Add to animation switch
case 'custom':
    animateCustom(tile);
    break;
```

### Creating Visual Elements
```html
<!-- Progress Bar -->
<div class="tile-progress">
    <div class="progress-bar" data-percent="85"></div>
</div>

<!-- Donut Chart -->
<div class="chart-container">
    <div class="donut-chart" data-value="90">
        <svg viewBox="0 0 42 42">
            <!-- SVG elements -->
        </svg>
    </div>
</div>
```

## Best Practices

### Content Guidelines
1. **Values**: Use impactful numbers that tell a story
2. **Labels**: Keep concise (2-3 words max)
3. **Details**: Provide context in hover/detail text
4. **Units**: Include units for clarity ($, %, x, etc.)

### Performance Optimization
1. **Stagger animations** to prevent jank
2. **Use CSS transforms** over position changes
3. **Implement `will-change`** for animated properties
4. **Lazy load** animations with Intersection Observer

### Accessibility
1. **ARIA labels** on interactive elements
2. **Keyboard navigation** support
3. **High contrast** between text and background
4. **Reduced motion** media query support

### Mobile Considerations
1. **Fixed heights** prevent layout shift
2. **Simplified visuals** for smaller screens
3. **Touch-friendly** tap targets (min 44x44px)
4. **Hidden details** to reduce clutter

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Animation not triggering | Missing `data-animate` | Add animation type attribute |
| Text overflow | Font size too large | Implement text fitting |
| Layout break on mobile | Grid span conflicts | Use responsive classes |
| Color not showing | Missing tile category class | Add appropriate class |

### Debugging
```javascript
// Enable animation debugging
window.DEBUG_ANIMATIONS = true;

// Log tile measurements
console.log('Tile dimensions:', tile.getBoundingClientRect());

// Force text refit
fitTextInTiles();
```

## Future Enhancements

### Planned Features
1. **Filter/Sort** capabilities
2. **Export** to PDF/Image
3. **Customizable** color themes
4. **Real-time** data updates
5. **Comparison** views

### Extension Points
- Custom animation types
- New visualization components
- Additional metric categories
- Interactive drill-downs
- Social sharing integration

## Resources

### Dependencies
- No external libraries required
- Pure CSS animations
- Vanilla JavaScript
- Modern browser features (CSS Grid, Custom Properties)

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with CSS Grid support

### Performance Metrics
- Initial render: <100ms
- Animation start: <300ms
- Full load: <500ms
- Memory usage: <10MB