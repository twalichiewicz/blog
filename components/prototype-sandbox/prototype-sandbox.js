/**
 * Reusable Prototype Sandbox Component
 * Provides isolated environment for blog prototypes with common features
 */

class PrototypeSandbox {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      autoStart: false,
      showControls: true,
      isolated: true,
      theme: 'youtube', // youtube, soundcloud, generic
      aspectRatio: '16/9',
      ...options
    };
    
    this.init();
  }

  init() {
    // Create sandbox structure
    this.createSandbox();
    
    // Setup isolation
    if (this.options.isolated) {
      this.setupIsolation();
    }
    
    // Add controls if needed
    if (this.options.showControls) {
      this.createControls();
    }
    
    // Setup play button if not auto-starting
    if (!this.options.autoStart) {
      this.createPlayButton();
    }
  }

  createSandbox() {
    // Wrap existing content in sandbox container
    const content = this.element.innerHTML;
    this.element.innerHTML = `
      <div class="prototype-sandbox" data-theme="${this.options.theme}">
        <div class="sandbox-preview">
          <div class="sandbox-content" style="aspect-ratio: ${this.options.aspectRatio}">
            ${content}
          </div>
          <div class="sandbox-overlay"></div>
        </div>
      </div>
    `;
    
    this.sandbox = this.element.querySelector('.prototype-sandbox');
    this.content = this.element.querySelector('.sandbox-content');
    this.overlay = this.element.querySelector('.sandbox-overlay');
  }

  setupIsolation() {
    // Prevent event bubbling
    this.sandbox.addEventListener('click', (e) => {
      if (!e.target.closest('a[href^="http"]')) {
        e.stopPropagation();
      }
    });
    
    // Contain scroll events
    this.content.addEventListener('wheel', (e) => {
      const { scrollTop, scrollHeight, clientHeight } = this.content;
      const isScrollable = scrollHeight > clientHeight;
      
      if (isScrollable) {
        // Prevent scroll when at boundaries
        if ((scrollTop === 0 && e.deltaY < 0) || 
            (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)) {
          e.preventDefault();
        }
        e.stopPropagation();
      }
    });
    
    // Trap focus for keyboard navigation
    this.sandbox.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = this.sandbox.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  createPlayButton() {
    const playBtn = document.createElement('button');
    playBtn.className = 'sandbox-play-button';
    playBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="48" height="48">
        <path fill="currentColor" d="M8 5v14l11-7z"/>
      </svg>
      <span>Start Interactive Demo</span>
    `;
    
    playBtn.addEventListener('click', () => {
      this.start();
    });
    
    this.overlay.appendChild(playBtn);
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'sandbox-controls';
    controls.innerHTML = `
      <button class="sandbox-reset" title="Reset demo">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
      <button class="sandbox-fullscreen" title="Fullscreen">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
      </button>
    `;
    
    // Reset button
    controls.querySelector('.sandbox-reset').addEventListener('click', () => {
      this.reset();
    });
    
    // Fullscreen button
    controls.querySelector('.sandbox-fullscreen').addEventListener('click', () => {
      this.toggleFullscreen();
    });
    
    this.sandbox.appendChild(controls);
  }

  start() {
    this.sandbox.classList.add('active');
    this.overlay.style.display = 'none';
    
    // Dispatch custom event for prototype-specific initialization
    this.element.dispatchEvent(new CustomEvent('prototypeStart', {
      detail: { sandbox: this }
    }));
  }

  reset() {
    // Reload content or reset state
    const event = new CustomEvent('prototypeReset', {
      detail: { sandbox: this }
    });
    this.element.dispatchEvent(event);
    
    // If no handler, reload the content
    if (!event.defaultPrevented) {
      const originalContent = this.content.innerHTML;
      this.content.innerHTML = '';
      setTimeout(() => {
        this.content.innerHTML = originalContent;
        this.start();
      }, 100);
    }
  }

  toggleFullscreen() {
    this.sandbox.classList.toggle('fullscreen');
    document.body.classList.toggle('prototype-fullscreen-active');
    
    // Handle escape key
    if (this.sandbox.classList.contains('fullscreen')) {
      document.addEventListener('keydown', this.handleEscape);
    } else {
      document.removeEventListener('keydown', this.handleEscape);
    }
  }

  handleEscape = (e) => {
    if (e.key === 'Escape') {
      this.toggleFullscreen();
    }
  }

  // Static method to auto-initialize all prototypes
  static autoInit() {
    document.querySelectorAll('[data-prototype-sandbox]').forEach(element => {
      const options = JSON.parse(element.dataset.prototypeSandbox || '{}');
      new PrototypeSandbox(element, options);
    });
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', PrototypeSandbox.autoInit);
} else {
  PrototypeSandbox.autoInit();
}

// Export for manual use
window.PrototypeSandbox = PrototypeSandbox;