/**
 * Portfolio Parallax Effect
 * Adds mouse-based parallax to portfolio product packaging
 */

(function() {
  'use strict';

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  
  function initPortfolioParallax() {
    const portfolioItems = document.querySelectorAll('.portfolio-item-wrapper');
    
    if (!portfolioItems.length) return;
    
    // Track mouse movement on the entire grid
    const portfolioGrid = document.querySelector('.portfolio-featured-grid');
    if (!portfolioGrid) return;
    
    portfolioGrid.addEventListener('mousemove', handleMouseMove);
    portfolioGrid.addEventListener('mouseleave', handleMouseLeave);
    
    // Apply parallax to each item
    portfolioItems.forEach(item => {
      const image = item.querySelector('.portfolio-image');
      if (!image) return;
      
      item.addEventListener('mouseenter', () => {
        item.classList.add('parallax-active');
      });
      
      item.addEventListener('mouseleave', () => {
        item.classList.remove('parallax-active');
        resetTransform(image);
      });
    });
  }
  
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      updateParallax();
      rafId = null;
    });
  }
  
  function handleMouseLeave() {
    const activeItems = document.querySelectorAll('.parallax-active');
    activeItems.forEach(item => {
      const image = item.querySelector('.portfolio-image');
      if (image) resetTransform(image);
      item.classList.remove('parallax-active');
    });
  }
  
  function updateParallax() {
    const activeItems = document.querySelectorAll('.portfolio-item-wrapper.parallax-active');
    
    activeItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const image = item.querySelector('.portfolio-image');
      if (!image) return;
      
      // Calculate mouse position relative to the item center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (mouseX - centerX) / rect.width;
      const deltaY = (mouseY - centerY) / rect.height;
      
      // Apply transforms based on mouse position
      const tiltX = deltaY * 15; // Max 15 degrees
      const tiltY = deltaX * -15; // Max 15 degrees (inverted for natural feel)
      
      // Update the 3D transform
      const beforeEl = image.querySelector('::before');
      const afterEl = image.querySelector('::after');
      const wrapper = image.querySelector('.image-wrapper');
      
      // Apply dynamic transform via inline styles
      image.style.setProperty('--tilt-x', `${tiltX}deg`);
      image.style.setProperty('--tilt-y', `${tiltY}deg`);
      image.style.setProperty('--mouse-x', deltaX);
      image.style.setProperty('--mouse-y', deltaY);
      
      // Update the parent portfolio-item--featured element
      const portfolioItem = item.querySelector('.portfolio-item--featured');
      if (portfolioItem) {
        portfolioItem.style.setProperty('--tilt-x', `${tiltX}deg`);
        portfolioItem.style.setProperty('--tilt-y', `${tiltY}deg`);
        portfolioItem.style.setProperty('--mouse-x', deltaX);
        portfolioItem.style.setProperty('--mouse-y', deltaY);
      }
    });
  }
  
  function resetTransform(image) {
    image.style.setProperty('--tilt-x', '0deg');
    image.style.setProperty('--tilt-y', '0deg');
    image.style.setProperty('--mouse-x', 0);
    image.style.setProperty('--mouse-y', 0);
    
    // Also reset the parent portfolio item
    const portfolioItem = image.closest('.portfolio-item--featured');
    if (portfolioItem) {
      portfolioItem.style.setProperty('--tilt-x', '0deg');
      portfolioItem.style.setProperty('--tilt-y', '0deg');
      portfolioItem.style.setProperty('--mouse-x', 0);
      portfolioItem.style.setProperty('--mouse-y', 0);
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioParallax);
  } else {
    initPortfolioParallax();
  }
  
  // Reinitialize on dynamic content load
  window.addEventListener('portfolio-loaded', initPortfolioParallax);
  window.addEventListener('portfolio-updated', initPortfolioParallax);
})();