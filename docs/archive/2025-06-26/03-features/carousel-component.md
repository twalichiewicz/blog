# Carousel Component Documentation

## Overview

The carousel component is a reusable, accessible media gallery that supports both images and videos. It includes an integrated spotlight modal for full-screen viewing with navigation controls.

## Usage

### Basic HTML Structure

```html
<div class="carousel" aria-label="Image gallery">
  <div class="carousel-track">
    <!-- Image slide -->
    <div class="carousel-slide active">
      <img src="image1.jpg" alt="Description">
    </div>
    
    <!-- Video slide -->
    <div class="carousel-slide">
      <video controls>
        <source src="video.webm" type="video/webm">
        <source src="video.mp4" type="video/mp4">
      </video>
    </div>
    
    <!-- More slides... -->
  </div>
  
  <!-- Navigation (auto-generated if multiple slides) -->
  <div class="carousel-indicators">
    <button class="carousel-button prev" aria-label="Previous slide"></button>
    <button class="indicator active" aria-label="Go to slide 1"></button>
    <button class="indicator" aria-label="Go to slide 2"></button>
    <button class="carousel-button next" aria-label="Next slide"></button>
  </div>
</div>
```

### In Hexo Posts

For blog posts, use the standard Markdown image syntax. Multiple images in sequence will automatically create a carousel:

```markdown
![Image 1](./image1.jpg)
![Image 2](./image2.jpg)
![Video](./video.mp4)
```

### In Project Galleries

Projects use the `gallery_images` front matter:

```yaml
gallery_images:
  - type: image
    url: ./screenshot1.png
    alt: Screenshot of the interface
    caption: Main dashboard view
  
  - type: video
    url: ./demo.mp4
    poster: ./video-poster.jpg
    autoplay: true
    loop: true
    muted: true
```

## Features

### Core Features
- **Responsive Design**: Adapts to all screen sizes
- **Mixed Media**: Supports images and videos in the same carousel
- **Lazy Loading**: Images load as needed for performance
- **Accessibility**: Full ARIA labels and keyboard navigation
- **Touch Support**: Swipe gestures on mobile devices

### Spotlight Modal
- **Activation**: Click any carousel item to open in full-screen
- **Navigation**: 
  - Previous/Next buttons
  - Indicator dots for direct navigation
  - Keyboard: Arrow keys to navigate, Escape to close
  - Touch: Swipe left/right on mobile
- **Video Support**: Videos display with full controls
- **Auto-sizing**: Content scales to fit the viewport

### Navigation Controls
- **Buttons**: Previous/next arrow buttons (hidden on mobile)
- **Indicators**: Dots showing current position and allowing direct navigation
- **Keyboard**: Arrow keys for navigation when focused
- **Touch**: Swipe gestures on touch devices

## JavaScript API

### Initialization

Carousels are automatically initialized when the page loads:

```javascript
// Manual initialization (if needed)
import { initializeCarousels } from './carousel.js';
initializeCarousels(container);
```

### Key Methods

- `goToSlide(index)`: Navigate to specific slide
- `next()`: Go to next slide
- `prev()`: Go to previous slide
- `openSpotlight(src, alt, index)`: Open spotlight modal
- `updateCarouselImages()`: Refresh the media items list

### Events

The carousel fires standard DOM events that can be listened to:

```javascript
carousel.addEventListener('click', (e) => {
  // Handle carousel clicks
});
```

## Styling

### CSS Classes

- `.carousel`: Main container
- `.carousel-track`: Slides container
- `.carousel-slide`: Individual slide
- `.carousel-slide.active`: Currently visible slide
- `.carousel-indicators`: Navigation controls container
- `.carousel-button`: Previous/next buttons
- `.indicator`: Position indicators
- `.spotlight-modal`: Full-screen modal
- `.spotlight-modal.active`: Visible modal

### Customization

Override these CSS variables for theming:

```css
.carousel {
  --carousel-bg: #000;
  --carousel-button-bg: rgba(0, 0, 0, 0.5);
  --carousel-button-hover: rgba(0, 0, 0, 0.7);
  --indicator-bg: rgba(255, 255, 255, 0.5);
  --indicator-active: #fff;
}
```

## Technical Implementation

### Media Detection

The carousel maintains a `carouselImages` array containing all media items:

```javascript
{
  type: 'image' | 'video',
  element: HTMLElement,
  src: string,        // Image src or video poster
  alt: string,
  slideIndex: number,
  videoSrc?: string   // For videos
}
```

### Dynamic Content Handling

For content loaded via AJAX (like project galleries):
1. Initial scan on construction
2. Re-scan on `init()`
3. Delayed scan after 500ms for async content
4. Force re-scan when opening spotlight if needed

### Spotlight Modal Updates

When navigating in spotlight:
1. Update `currentSpotlightIndex`
2. Call `updateSpotlightContent()` to swap media
3. Update indicator states
4. Handle transitions between images and videos

## Troubleshooting

### Common Issues

1. **No navigation indicators in spotlight**
   - Ensure carousel has multiple media items
   - Check that videos are being counted
   - Look for console errors about media detection

2. **Videos not playing in spotlight**
   - Verify video sources are correct
   - Check browser video format support
   - Ensure autoplay policies aren't blocking

3. **Carousel not initializing**
   - Check for JavaScript errors
   - Verify HTML structure matches expected format
   - Ensure carousel.js is loaded

### Debug Mode

Enable debug logging by checking console output:
- Media detection logs
- Spotlight state changes
- Navigation events

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with touch support
- Requires JavaScript enabled
- Video format support varies by browser