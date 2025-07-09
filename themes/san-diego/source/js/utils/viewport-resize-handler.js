/**
 * Viewport Resize Handler
 * Prevents double scrollbars during viewport resize transitions
 */

class ViewportResizeHandler {
  constructor() {
    this.resizeTimeout = null;
    this.isResizing = false;
    this.previousWidth = window.innerWidth;
    this.mobileBreakpoint = 768;
    this.tabletBreakpoint = 1024;
    
    this.init();
  }
  
  init() {
    // Initial setup
    this.handleViewportChange();
    
    // Listen for resize events
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }
  
  handleResize() {
    const currentWidth = window.innerWidth;
    
    // Only handle if crossing breakpoints
    const wasDesktop = this.previousWidth > this.mobileBreakpoint;
    const isMobile = currentWidth <= this.mobileBreakpoint;
    
    if ((wasDesktop && isMobile) || (!wasDesktop && !isMobile)) {
      // Crossing desktop/mobile boundary
      this.startResizeTransition();
    }
    
    this.previousWidth = currentWidth;
    
    // Debounce the end of resize
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.endResizeTransition();
    }, 300);
  }
  
  handleOrientationChange() {
    this.startResizeTransition();
    setTimeout(() => {
      this.endResizeTransition();
    }, 500);
  }
  
  startResizeTransition() {
    if (this.isResizing) return;
    
    this.isResizing = true;
    document.body.classList.add('viewport-resizing');
    
    // Clean up any conflicting scroll styles
    this.cleanupScrollStyles();
  }
  
  endResizeTransition() {
    this.isResizing = false;
    document.body.classList.remove('viewport-resizing');
    
    // Re-apply correct scroll behavior for current viewport
    this.handleViewportChange();
  }
  
  cleanupScrollStyles() {
    const blogContent = document.querySelector('.blog-content');
    const contentWrapper = document.querySelector('.content-wrapper');
    const postsContent = document.getElementById('postsContent');
    const projectsContent = document.getElementById('projectsContent');
    
    // Temporarily remove inline styles that might conflict
    [blogContent, contentWrapper, postsContent, projectsContent].forEach(el => {
      if (el) {
        el.style.removeProperty('overflow');
        el.style.removeProperty('height');
        el.style.removeProperty('overflow-y');
        el.style.removeProperty('overflow-x');
      }
    });
  }
  
  handleViewportChange() {
    const isMobile = window.innerWidth <= this.mobileBreakpoint;
    const blogContent = document.querySelector('.blog-content');
    
    if (!blogContent) return;
    
    if (isMobile) {
      // Mobile: ensure natural scrolling
      this.setupMobileScrolling();
    } else {
      // Desktop/Tablet: container-based scrolling
      this.setupDesktopScrolling();
    }
    
    // Force reflow to ensure styles are applied
    void blogContent.offsetHeight;
  }
  
  setupMobileScrolling() {
    // Remove any height constraints on mobile
    const blog = document.querySelector('.blog');
    const blogContent = document.querySelector('.blog-content');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    if (blog) {
      blog.style.height = 'auto';
      blog.style.overflow = 'visible';
    }
    
    if (blogContent) {
      blogContent.style.height = 'auto';
      blogContent.style.overflow = 'visible';
    }
    
    if (contentWrapper) {
      contentWrapper.style.height = 'auto';
      contentWrapper.style.overflow = 'visible';
    }
    
    // Ensure body can scroll
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
  
  setupDesktopScrolling() {
    // Desktop has specific scroll containers handled by CSS
    // Just ensure no conflicting inline styles
    const elements = [
      document.querySelector('.blog'),
      document.querySelector('.blog-content'),
      document.querySelector('.content-wrapper')
    ];
    
    elements.forEach(el => {
      if (el && el.style.overflow === 'visible') {
        el.style.removeProperty('overflow');
      }
      if (el && el.style.height === 'auto') {
        el.style.removeProperty('height');
      }
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.viewportResizeHandler = new ViewportResizeHandler();
  });
} else {
  window.viewportResizeHandler = new ViewportResizeHandler();
}

export default ViewportResizeHandler;