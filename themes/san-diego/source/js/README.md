# JavaScript Architecture

## Overview
This directory contains all client-side JavaScript for the blog. Files are organized by functionality and loaded as needed.

## File Structure

### Core Files
- `main.js` - Main entry point, initializes core functionality
- `blog.js` - Blog-specific functionality (dynamic content loading, back button)
- `home.js` - Homepage-specific initialization
- `device-detection.js` - Detects device type and adjusts UI

### Navigation & Scrolling
- `anchor-links-simple.js` - Handles in-page anchor link navigation
- `scroll.js` - General scroll functionality
- `mobile-tabs.js` - Tab switching for mobile devices

### UI Components
- `carousel.js` - Image carousel functionality
- `project-tabs.js` - Project page tab navigation
- `project-summary.js` - Project summary display logic
- `search.js` - Search functionality

### Utilities
- `components/` - Reusable component modules
- `utils/` - Utility functions (animations, colors, etc.)

## Known Issues

### 1. Multiple Scroll Handlers
Several files implement similar scroll logic:
- `scroll.js` - General scroll to top/section
- `blog.js` - Blog post scroll functionality  
- `anchor-links-simple.js` - Anchor link scrolling

**Impact**: Potential conflicts and duplicate code
**TODO**: Consolidate into single scroll utility

### 2. Global Variable Dependencies
Many scripts rely on global variables:
- `window.mobileTabs`
- `window.scrollToFullStory`
- `window.initializeAnchorLinks`

**Impact**: Load order dependencies, potential race conditions
**TODO**: Implement proper module system

### 3. Event Listener Management
No centralized event delegation system, leading to:
- Multiple listeners on same elements
- Memory leaks from unremoved listeners
- Conflicts between handlers

**TODO**: Implement event delegation pattern

## Best Practices

### Adding New Features
1. Check if similar functionality exists
2. Use existing utilities where possible
3. Document global dependencies
4. Add error handling
5. Test on mobile and desktop

### Event Handling
```javascript
// Good: Remove old handlers
if (element._handler) {
  element.removeEventListener('click', element._handler);
}
element._handler = newHandler;
element.addEventListener('click', newHandler);

// Better: Use event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.my-selector')) {
    // Handle click
  }
});
```

### Error Handling
```javascript
// Always check elements exist
const element = document.querySelector('.my-element');
if (!element) {
  console.warn('Element not found: .my-element');
  return;
}
```

## Loading Order
1. `device-detection.js` - Must load first
2. `main.js` - Core initialization
3. Component scripts - As needed per page
4. Page-specific scripts - Last

## Performance Notes
- Scripts are minified in production
- Consider lazy loading for feature-specific code
- Avoid synchronous operations in event handlers
- Use `requestAnimationFrame` for animations