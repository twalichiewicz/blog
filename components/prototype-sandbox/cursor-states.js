/**
 * Dynamic Cursor State Management
 * Allows prototypes to change cursor based on interaction state
 */

class CursorStateManager {
  constructor(container) {
    this.container = container;
    this.originalCursor = null;
    this.init();
  }

  init() {
    // Track mousedown/mouseup for active states
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Track drag operations
    this.initDragTracking();
    
    // Track loading states
    this.observeLoadingStates();
  }

  handleMouseDown(e) {
    const target = e.target;
    
    // Check if target is clickable
    if (this.isClickable(target)) {
      // Store original cursor
      this.originalCursor = getComputedStyle(target).cursor;
      
      // Apply active cursor
      target.style.cursor = 'var(--cursor-active)';
      
      // Add class for CSS targeting
      target.classList.add('cursor-active');
    }
  }

  handleMouseUp(e) {
    // Remove all active cursors
    const activeElements = this.container.querySelectorAll('.cursor-active');
    activeElements.forEach(el => {
      el.classList.remove('cursor-active');
      el.style.cursor = ''; // Reset to CSS-defined cursor
    });
  }

  isClickable(element) {
    const clickableTags = ['BUTTON', 'A'];
    const clickableRoles = ['button', 'link', 'tab'];
    
    return clickableTags.includes(element.tagName) ||
           clickableRoles.includes(element.getAttribute('role')) ||
           element.classList.contains('clickable') ||
           element.hasAttribute('onclick');
  }

  initDragTracking() {
    const draggables = this.container.querySelectorAll('.draggable, [draggable="true"]');
    
    draggables.forEach(el => {
      el.addEventListener('dragstart', () => {
        el.classList.add('dragging');
      });
      
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });
    });
  }

  observeLoadingStates() {
    // Watch for data-loading attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-loading') {
          const target = mutation.target;
          if (target.getAttribute('data-loading') === 'true') {
            target.classList.add('cursor-loading');
          } else {
            target.classList.remove('cursor-loading');
          }
        }
      });
    });
    
    // Observe all elements with data-loading attribute
    const loadingElements = this.container.querySelectorAll('[data-loading]');
    loadingElements.forEach(el => {
      observer.observe(el, { attributes: true, attributeFilter: ['data-loading'] });
    });
  }

  // Public methods for manual cursor changes
  setCursor(element, cursorType) {
    const validTypes = ['default', 'interactive', 'active', 'grab', 'grabbing', 'loading', 'disabled'];
    
    if (validTypes.includes(cursorType)) {
      // Remove all cursor classes
      validTypes.forEach(type => {
        element.classList.remove(`cursor-${type}`);
      });
      
      // Add new cursor class
      element.classList.add(`cursor-${cursorType}`);
    }
  }

  // Show loading cursor during async operations
  async withLoadingCursor(element, asyncFn) {
    this.setCursor(element, 'loading');
    element.setAttribute('data-loading', 'true');
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      element.setAttribute('data-loading', 'false');
      this.setCursor(element, 'interactive');
    }
  }
}

// Auto-initialize for prototypes
document.addEventListener('DOMContentLoaded', () => {
  // Find all prototypes with advanced cursor support
  const prototypes = document.querySelectorAll('.advanced-prototype, [data-cursor-states="true"]');
  
  prototypes.forEach(prototype => {
    new CursorStateManager(prototype);
  });
});

// Export for manual use
window.CursorStateManager = CursorStateManager;

// Utility function for temporary cursor changes
window.temporaryCursor = function(element, cursorType, duration = 1000) {
  const manager = new CursorStateManager(element.closest('.advanced-prototype'));
  manager.setCursor(element, cursorType);
  
  setTimeout(() => {
    manager.setCursor(element, 'interactive');
  }, duration);
};