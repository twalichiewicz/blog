/**
 * Responsive Tables Component
 * Handles table scroll indicators, sticky headers, and mobile optimizations
 */

export function initResponsiveTables() {
  const scrollContainers = document.querySelectorAll('.table-scroll-container');
  
  scrollContainers.forEach(container => {
    const table = container.querySelector('table');
    if (!table) return;
    
    // Check if table needs horizontal scroll
    function checkScroll() {
      const hasScroll = table.scrollWidth > container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const maxScroll = table.scrollWidth - container.clientWidth;
      
      // Update classes for scroll indicators
      container.classList.toggle('has-scroll', hasScroll);
      container.classList.toggle('scrolled', scrollLeft > 10);
      container.classList.toggle('at-end', scrollLeft >= maxScroll - 10);
      
      // Add aria labels for accessibility
      if (hasScroll) {
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Scrollable table');
        container.setAttribute('tabindex', '0');
      }
    }
    
    // Initialize
    checkScroll();
    
    // Update on scroll
    container.addEventListener('scroll', checkScroll, { passive: true });
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScroll, 100);
    }, { passive: true });
    
    // Touch device enhancements
    if ('ontouchstart' in window) {
      container.style.scrollbarWidth = 'thin';
      container.style.WebkitOverflowScrolling = 'touch';
      
      // Add touch scroll hint
      let touchStartX = 0;
      container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      
      container.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        
        // Show scroll indicators on touch
        if (Math.abs(deltaX) > 5) {
          container.classList.add('touch-scrolling');
        }
      }, { passive: true });
      
      container.addEventListener('touchend', () => {
        container.classList.remove('touch-scrolling');
      }, { passive: true });
    }
    
    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
      const scrollAmount = 50;
      
      switch(e.key) {
        case 'ArrowLeft':
          container.scrollLeft -= scrollAmount;
          e.preventDefault();
          break;
        case 'ArrowRight':
          container.scrollLeft += scrollAmount;
          e.preventDefault();
          break;
        case 'Home':
          container.scrollLeft = 0;
          e.preventDefault();
          break;
        case 'End':
          container.scrollLeft = container.scrollWidth;
          e.preventDefault();
          break;
      }
    });
    
    // Focus management for accessibility
    container.addEventListener('focus', () => {
      container.classList.add('focused');
    });
    
    container.addEventListener('blur', () => {
      container.classList.remove('focused');
    });
  });
  
  // Handle zoom changes
  let lastDevicePixelRatio = window.devicePixelRatio;
  
  function checkZoom() {
    if (window.devicePixelRatio !== lastDevicePixelRatio) {
      lastDevicePixelRatio = window.devicePixelRatio;
      
      // Recalculate table dimensions on zoom
      scrollContainers.forEach(container => {
        const checkScroll = () => {
          const table = container.querySelector('table');
          if (!table) return;
          
          const hasScroll = table.scrollWidth > container.clientWidth;
          container.classList.toggle('has-scroll', hasScroll);
        };
        checkScroll();
      });
    }
  }
  
  // Check for zoom changes periodically
  setInterval(checkZoom, 500);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResponsiveTables);
} else {
  initResponsiveTables();
}