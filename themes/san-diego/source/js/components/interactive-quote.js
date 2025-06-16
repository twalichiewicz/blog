/**
 * Interactive Quote Component JavaScript
 * Minimal, focused enhancement for the interactive quote component
 */

export class InteractiveQuote {
  constructor(element) {
    this.element = element;
    this.isInView = false;
    
    // Only initialize if not already initialized
    if (element.dataset.initialized) return;
    element.dataset.initialized = 'true';
    
    this.init();
  }

  init() {
    // Intersection Observer for fade-in animation
    if ('IntersectionObserver' in window && this.element.classList.contains('fade-in-up')) {
      this.setupIntersectionObserver();
    }

    // Keyboard navigation enhancement
    this.setupKeyboardInteraction();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isInView) {
            this.isInView = true;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(this.element);
  }

  setupKeyboardInteraction() {
    // Allow keyboard users to trigger hover effects
    this.element.addEventListener('focus', () => {
      this.element.classList.add('keyboard-focus');
    });

    this.element.addEventListener('blur', () => {
      this.element.classList.remove('keyboard-focus');
    });

    // Enter key to "activate" quote (for future features)
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.defaultPrevented) {
        this.element.dispatchEvent(new CustomEvent('quote:activate', {
          detail: {
            text: this.element.querySelector('.quote-text')?.textContent,
            author: this.element.querySelector('.quote-citation cite')?.textContent
          },
          bubbles: true
        }));
      }
    });
  }

  // Static initialization method
  static init(selector = '.interactive-quote') {
    const quotes = document.querySelectorAll(selector);
    return Array.from(quotes).map(quote => new InteractiveQuote(quote));
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => InteractiveQuote.init());
} else {
  InteractiveQuote.init();
}

// Export for use in other modules
export default InteractiveQuote;