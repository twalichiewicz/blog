// Add this new file to handle all scroll-related behaviors
const initScrollBehaviors = function() {
  // Prevent scroll chaining/bouncing on iOS
  document.body.style.overscrollBehavior = 'none';
  
  // Smooth scroll to anchors - DISABLED to allow blog.js to handle anchor links
  // The blog page has its own custom anchor link handler with glow effects
  /*
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  */

  // Handle fixed header offset for anchor links
  function adjustScrollPosition() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const headerOffset = document.querySelector('nav')?.offsetHeight || 0;
        window.scrollTo({
          top: target.offsetTop - headerOffset,
          behavior: 'smooth'
        });
      }
    }
  }

  // Adjust scroll position after page load
  window.addEventListener('load', adjustScrollPosition);
  
  // Store handler for cleanup
  window._scrollAdjustHandler = adjustScrollPosition;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollBehaviors);
} else {
  initScrollBehaviors();
} 