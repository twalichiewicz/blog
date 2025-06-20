/**
 * Scroll.js - Simplified to use ScrollUtility
 * This file now serves as an initialization point for the scroll utility
 */
import ScrollUtility from './utils/scroll-utility.js';

// The ScrollUtility auto-initializes, but we can add any additional 
// site-specific scroll configurations here if needed
document.addEventListener('DOMContentLoaded', function() {
  // Any additional scroll-related setup can go here
  // The ScrollUtility handles:
  // - iOS overscroll behavior
  // - Anchor link smooth scrolling
  // - Fixed header offset
  // - Initial hash handling
  
  // Make ScrollUtility available globally if needed by other scripts
  window.ScrollUtility = ScrollUtility;
}); 