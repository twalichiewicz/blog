/**
 * Code Sandbox Component
 * A reusable component for wrapping interactive content with toggle controls
 * Default behavior: Suspends JavaScript execution when toggled off
 */
(function() {
  'use strict';

  class CodeSandbox {
    constructor(element, options = {}) {
      this.wrapper = element;
      this.content = element.querySelector('.code-sandbox-content');
      this.toggle = element.querySelector('.code-sandbox-toggle');
      
      if (!this.content || !this.toggle) {
        return;
      }

      // Default options
      this.options = {
        autoToggleOnScroll: true,
        suspendOnHide: true,
        resetOnShow: false,
        onShow: null,
        onHide: null,
        ...options
      };

      this.isOn = !this.wrapper.classList.contains('collapsed');
      this.wasAutoToggled = false;
      this.suspendedScripts = [];
      this.animationFrames = [];
      this.timeouts = [];
      this.intervals = [];

      this.init();
    }

    init() {
      // Set initial state
      this.updateToggleState();

      // Bind event handlers
      this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
      this.toggle.addEventListener('keydown', (e) => this.handleToggleKeydown(e));

      // Set up scroll observer if enabled
      if (this.options.autoToggleOnScroll) {
        this.setupScrollObserver();
      }

      // Store sandbox instance on element
      this.wrapper.codeSandbox = this;
    }

    handleToggleClick(e) {
      e.stopPropagation();
      this.setToggleState(!this.isOn, false);
      this.wasAutoToggled = false;
      
      // Play small click sound
      if (window.playSmallClickSound) {
        window.playSmallClickSound();
      }
    }

    handleToggleKeydown(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        this.setToggleState(!this.isOn, false);
        this.wasAutoToggled = false;
      }
    }

    setToggleState(on, isAutomatic = false) {
      this.isOn = on;

      if (this.isOn) {
        this.show(isAutomatic);
      } else {
        this.hide(isAutomatic);
      }

      this.updateToggleState();
    }

    show(isAutomatic = false) {
      this.wrapper.classList.remove('collapsed');
      this.wasAutoToggled = false;

      // Resume suspended scripts
      if (this.options.suspendOnHide) {
        this.resumeScripts();
      }

      // Call custom onShow handler
      if (this.options.onShow) {
        this.options.onShow.call(this, this.content);
      }

      // Reset content if configured
      if (this.options.resetOnShow && this.options.resetFunction) {
        this.options.resetFunction.call(this, this.content);
      }
    }

    hide(isAutomatic = false) {
      this.wrapper.classList.add('collapsed');

      if (isAutomatic) {
        this.wasAutoToggled = true;
      }

      // Suspend scripts to prevent lag
      if (this.options.suspendOnHide) {
        this.suspendScripts();
      }

      // Call custom onHide handler
      if (this.options.onHide) {
        this.options.onHide.call(this, this.content);
      }
    }

    updateToggleState() {
      this.toggle.classList.toggle('active', this.isOn);
      this.toggle.setAttribute('aria-checked', this.isOn);
    }

    suspendScripts() {
      // Store and clear all animation frames within the content
      const animationFrameIds = this.content.animationFrameIds || [];
      animationFrameIds.forEach(id => {
        cancelAnimationFrame(id);
        this.animationFrames.push(id);
      });

      // Store and clear all timeouts
      const timeoutIds = this.content.timeoutIds || [];
      timeoutIds.forEach(id => {
        clearTimeout(id);
        this.timeouts.push(id);
      });

      // Store and clear all intervals
      const intervalIds = this.content.intervalIds || [];
      intervalIds.forEach(id => {
        clearInterval(id);
        this.intervals.push(id);
      });

      // Dispatch custom event for content to handle suspension
      this.content.dispatchEvent(new CustomEvent('sandbox:suspend', { 
        bubbles: true,
        detail: { sandbox: this }
      }));
    }

    resumeScripts() {
      // Dispatch custom event for content to handle resumption
      this.content.dispatchEvent(new CustomEvent('sandbox:resume', { 
        bubbles: true,
        detail: { sandbox: this }
      }));

      // Clear stored references
      this.animationFrames = [];
      this.timeouts = [];
      this.intervals = [];
    }

    setupScrollObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Element is visible
            if (this.wasAutoToggled && !this.isOn) {
              // Auto-turn ON only if it was auto-turned OFF
              this.setToggleState(true, true);
            }
          } else {
            // Element is not visible
            if (this.isOn) {
              // Auto-turn OFF if currently ON
              this.setToggleState(false, true);
            }
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      observer.observe(this.wrapper);
    }

    // Public API methods
    toggle() {
      this.setToggleState(!this.isOn);
    }

    suspend() {
      if (this.isOn) {
        this.setToggleState(false);
      }
    }

    resume() {
      if (!this.isOn) {
        this.setToggleState(true);
      }
    }

    destroy() {
      // Remove event listeners
      this.toggle.removeEventListener('click', this.handleToggleClick);
      this.toggle.removeEventListener('keydown', this.handleToggleKeydown);

      // Clean up observer
      if (this.observer) {
        this.observer.disconnect();
      }

      // Remove instance reference
      delete this.wrapper.codeSandbox;
    }
  }

  // Initialize all code sandboxes on DOM ready
  function initializeCodeSandboxes() {
    const sandboxes = document.querySelectorAll('.code-sandbox-wrapper[data-auto-init="true"]');
    sandboxes.forEach(sandbox => {
      if (!sandbox.codeSandbox) {
        new CodeSandbox(sandbox);
      }
    });
  }

  // Reinitialize code sandboxes (useful for dynamic content)
  function reinitializeCodeSandboxes() {
    const sandboxes = document.querySelectorAll('.code-sandbox-wrapper[data-auto-init="true"]');
    sandboxes.forEach(sandbox => {
      // Skip if already initialized
      if (sandbox.codeSandbox) return;
      
      const sandboxId = sandbox.getAttribute('data-sandbox-id');
      
      // Check if there's a stored initializer for this sandbox
      if (sandboxId && window.sandboxInitializers && window.sandboxInitializers[sandboxId]) {
        // Use the stored initializer
        window.sandboxInitializers[sandboxId]();
      } else {
        // Fall back to basic initialization
        new CodeSandbox(sandbox);
      }
    });
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCodeSandboxes);
  } else {
    initializeCodeSandboxes();
  }

  // Reinitialize when navigating (for single-page apps or dynamic content)
  // Listen for common navigation events
  window.addEventListener('popstate', reinitializeCodeSandboxes);
  
  // Also reinitialize on visibility change (when returning to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(reinitializeCodeSandboxes, 100);
    }
  });

  // Watch for dynamically added content
  const observer = new MutationObserver((mutations) => {
    let hasNewSandboxes = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.classList && node.classList.contains('code-sandbox-wrapper') && 
              node.getAttribute('data-auto-init') === 'true') {
            hasNewSandboxes = true;
          } else if (node.querySelector && 
                     node.querySelector('.code-sandbox-wrapper[data-auto-init="true"]')) {
            hasNewSandboxes = true;
          }
        }
      });
    });
    
    if (hasNewSandboxes) {
      setTimeout(reinitializeCodeSandboxes, 100);
    }
  });

  // Start observing when DOM is ready
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Listen for SD theme events if available
  if (window.SD && window.SD.events) {
    // Reinitialize when blog content is loaded
    window.SD.events.on('blog:content-loaded', reinitializeCodeSandboxes);
    window.SD.events.on('blog:content-reinitialized', reinitializeCodeSandboxes);
    window.SD.events.on('portfolio:content-loaded', reinitializeCodeSandboxes);
    window.SD.events.on('page:changed', reinitializeCodeSandboxes);
  }

  // Expose to global scope for manual initialization
  window.CodeSandbox = CodeSandbox;
  window.reinitializeCodeSandboxes = reinitializeCodeSandboxes;
})();