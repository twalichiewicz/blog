/**
 * Optimized Portfolio Parallax Effect
 * High-performance mouse-based parallax with GPU acceleration
 */

(function() {
  'use strict';

  // Performance optimizations
  const THROTTLE_MS = 16; // 60fps max
  const DAMPING_FACTOR = 0.1; // Smooth interpolation
  const MAX_TILT = 12; // Maximum tilt in degrees
  const PERSPECTIVE = 1000; // Perspective distance
  
  // State management
  const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null,
    isAnimating: false,
    activeItems: new Set(),
    lastUpdate: 0
  };
  
  // Cache DOM elements
  let portfolioGrid = null;
  let portfolioItems = [];
  
  function initPortfolioParallax() {
    // Find elements
    portfolioGrid = document.querySelector('.portfolio-featured-grid');
    if (!portfolioGrid) return;
    
    portfolioItems = Array.from(document.querySelectorAll('.portfolio-item-wrapper'));
    if (!portfolioItems.length) return;
    
    // Prepare items for GPU acceleration
    portfolioItems.forEach(item => {
      const portfolioItem = item.querySelector('.portfolio-item--featured');
      const imageWrapper = item.querySelector('.image-wrapper');
      const hasNotebook = item.querySelector('.notebook');
      
      // Skip notebook items - they have their own hover animation
      if (hasNotebook) {
        console.log('Skipping parallax for notebook item');
        return;
      }
      
      if (portfolioItem) {
        // Force GPU layer creation
        portfolioItem.style.willChange = 'transform';
        portfolioItem.style.transform = 'translateZ(0)';
      }
      
      if (imageWrapper) {
        imageWrapper.style.willChange = 'transform';
        imageWrapper.style.transform = 'translateZ(0)';
      }
      
      // Store element references for faster access
      item._refs = {
        portfolioItem,
        imageWrapper,
        bounds: null
      };
    });
    
    // Bind events with passive listeners for better scrolling performance
    portfolioGrid.addEventListener('mousemove', handleMouseMove, { passive: true });
    portfolioGrid.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    portfolioGrid.addEventListener('touchmove', handleTouchMove, { passive: true });
    portfolioGrid.addEventListener('touchend', handleMouseLeave, { passive: true });
    
    // Start animation loop
    startAnimationLoop();
  }
  
  function handleMouseMove(e) {
    const now = performance.now();
    if (now - state.lastUpdate < THROTTLE_MS) return;
    
    state.targetX = e.clientX;
    state.targetY = e.clientY;
    state.lastUpdate = now;
    
    // Update active items based on hover
    updateActiveItems(e);
  }
  
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: document.elementFromPoint(touch.clientX, touch.clientY)
      });
    }
  }
  
  function handleMouseLeave() {
    // Smoothly reset all items
    state.activeItems.clear();
    portfolioItems.forEach(item => {
      if (item._refs.portfolioItem) {
        item._refs.portfolioItem.classList.remove('parallax-active');
      }
    });
  }
  
  function updateActiveItems(e) {
    // Find which item is being hovered
    const hoveredItem = e.target.closest('.portfolio-item-wrapper');
    
    portfolioItems.forEach(item => {
      // Skip items without refs (notebook items)
      if (!item._refs || !item._refs.portfolioItem) return;
      
      if (item === hoveredItem) {
        state.activeItems.add(item);
        item._refs.portfolioItem.classList.add('parallax-active');
        // Cache bounds for performance
        item._refs.bounds = item.getBoundingClientRect();
      } else {
        state.activeItems.delete(item);
        item._refs.portfolioItem.classList.remove('parallax-active');
      }
    });
  }
  
  function startAnimationLoop() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    animate();
  }
  
  function animate() {
    // Smooth interpolation
    state.mouseX += (state.targetX - state.mouseX) * DAMPING_FACTOR;
    state.mouseY += (state.targetY - state.mouseY) * DAMPING_FACTOR;
    
    // Update only active items
    state.activeItems.forEach(item => {
      // Skip items without refs (notebook items)
      if (!item._refs || !item._refs.bounds || !item._refs.portfolioItem) return;
      
      const rect = item._refs.bounds;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized position (-1 to 1)
      const deltaX = (state.mouseX - centerX) / (rect.width / 2);
      const deltaY = (state.mouseY - centerY) / (rect.height / 2);
      
      // Clamp values
      const clampedX = Math.max(-1, Math.min(1, deltaX));
      const clampedY = Math.max(-1, Math.min(1, deltaY));
      
      // Calculate tilts
      const tiltX = clampedY * MAX_TILT;
      const tiltY = clampedX * -MAX_TILT;
      
      // Apply optimized transform
      if (item._refs.portfolioItem) {
        const transform = `perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        item._refs.portfolioItem.style.transform = transform;
      }
      
      // Apply subtle shadow movement
      if (item._refs.imageWrapper) {
        const shadowX = clampedX * 10;
        const shadowY = clampedY * 10;
        const shadowBlur = 30 + Math.abs(clampedX * clampedY) * 20;
        const shadowOpacity = 0.2 + Math.abs(clampedX * clampedY) * 0.1;
        
        item._refs.imageWrapper.style.boxShadow = `
          0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}),
          0 ${shadowY * 0.5}px ${shadowBlur * 0.5}px rgba(0, 0, 0, ${shadowOpacity * 0.5})
        `;
      }
    });
    
    // Reset non-active items smoothly
    portfolioItems.forEach(item => {
      if (!state.activeItems.has(item) && item._refs.portfolioItem) {
        const currentTransform = item._refs.portfolioItem.style.transform;
        if (currentTransform && currentTransform !== 'translateZ(0)') {
          item._refs.portfolioItem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
          if (item._refs.imageWrapper) {
            item._refs.imageWrapper.style.boxShadow = '';
          }
        }
      }
    });
    
    state.rafId = requestAnimationFrame(animate);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioParallax);
  } else {
    initPortfolioParallax();
  }
  
  // Reinitialize on dynamic content load
  window.addEventListener('portfolio-loaded', () => {
    // Clean up before reinit
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    state.activeItems.clear();
    initPortfolioParallax();
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
  });
})();