/**
 * Button Component
 * A flexible, accessible button component with multiple variants and states
 */

import Component from '../../utilities/base-component.js';

export default class Button extends Component {
  /**
   * Default options
   * @static
   */
  static defaults = {
    variant: 'default',      // default, primary, secondary, ghost, soft
    size: 'md',             // sm, md, lg
    ripple: true,           // Enable ripple effect
    loadingText: 'Loading...', // Text to show when loading
    disableOnClick: false,  // Auto-disable on click (for forms)
    hapticFeedback: true,   // Trigger haptic feedback on mobile
    soundEffect: true       // Play sound effect on click
  };

  /**
   * Component name for registration
   * @static
   */
  static componentName = 'button';

  /**
   * Initialize button
   */
  setupDOM() {
    super.setupDOM();
    
    // Add component class
    this.addClass(this.element, 'btn');
    
    // Apply variant and size
    this.updateVariant(this.options.variant);
    this.updateSize(this.options.size);
    
    // Setup ripple if enabled
    if (this.options.ripple && !this.element.disabled) {
      this.setupRipple();
    }
    
    // Store original text for loading state
    this._originalText = this.element.textContent;
    
    // Check for icon
    this._icon = this.find('.btn__icon');
    
    // Setup loading spinner
    if (!this.find('.btn__spinner')) {
      this._spinner = document.createElement('span');
      this._spinner.className = 'btn__spinner';
      this._spinner.setAttribute('aria-hidden', 'true');
      this.element.appendChild(this._spinner);
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    super.bindEvents();
    
    // Click handler
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
    
    // Keyboard support
    this.addEventListener(this.element, 'keydown', this.handleKeydown.bind(this));
    
    // Touch events for mobile
    if ('ontouchstart' in window) {
      this.addEventListener(this.element, 'touchstart', this.handleTouchStart.bind(this), { passive: true });
      this.addEventListener(this.element, 'touchend', this.handleTouchEnd.bind(this));
    }
  }

  /**
   * Handle click event
   * @param {Event} event
   */
  handleClick(event) {
    // Don't do anything if disabled or loading
    if (this.element.disabled || this.hasClass(this.element, 'is-loading')) {
      event.preventDefault();
      return;
    }
    
    // Play sound effect if enabled
    if (this.options.soundEffect && window.soundEffects?.playButtonPress) {
      window.soundEffects.playButtonPress();
    }
    
    // Auto-disable if configured
    if (this.options.disableOnClick) {
      this.disable();
    }
    
    // Emit click event
    this.emit('btn:click', { button: this });
  }

  /**
   * Handle keydown event
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    // Trigger click on Enter or Space for links styled as buttons
    if ((event.key === 'Enter' || event.key === ' ') && this.element.tagName === 'A') {
      event.preventDefault();
      this.element.click();
    }
  }

  /**
   * Handle touch start
   * @param {TouchEvent} event
   */
  handleTouchStart(event) {
    this.addClass(this.element, 'is-pressed');
    
    // Haptic feedback if available
    if (this.options.hapticFeedback && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  }

  /**
   * Handle touch end
   * @param {TouchEvent} event
   */
  handleTouchEnd(event) {
    this.removeClass(this.element, 'is-pressed');
  }

  /**
   * Setup ripple effect
   */
  setupRipple() {
    this.addClass(this.element, 'btn--ripple');
    
    this.addEventListener(this.element, 'click', (event) => {
      const ripple = document.createElement('span');
      ripple.className = 'btn__ripple';
      
      const rect = this.element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.element.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => ripple.remove(), 600);
    });
  }

  /**
   * Update button variant
   * @param {string} variant
   */
  updateVariant(variant) {
    // Remove old variant class
    const oldVariant = this.getAttribute(this.element, 'data-variant');
    if (oldVariant) {
      this.removeClass(this.element, `btn--${oldVariant}`);
    }
    
    // Add new variant class
    this.addClass(this.element, `btn--${variant}`);
    this.setAttribute(this.element, 'data-variant', variant);
  }

  /**
   * Update button size
   * @param {string} size
   */
  updateSize(size) {
    // Remove old size class
    const oldSize = this.getAttribute(this.element, 'data-size');
    if (oldSize) {
      this.removeClass(this.element, `btn--${oldSize}`);
    }
    
    // Add new size class
    this.addClass(this.element, `btn--${size}`);
    this.setAttribute(this.element, 'data-size', size);
  }

  /**
   * Set loading state
   * @param {boolean} isLoading
   * @param {string} [loadingText] - Optional custom loading text
   */
  setLoading(isLoading, loadingText) {
    this.toggleClass(this.element, 'is-loading', isLoading);
    this.element.disabled = isLoading;
    this.setAttribute(this.element, 'aria-busy', isLoading ? 'true' : 'false');
    
    const textElement = this.find('.btn__text') || this.element;
    
    if (isLoading) {
      // Store current text if not already stored
      if (!this._currentText) {
        this._currentText = textElement.textContent;
      }
      
      // Update text
      textElement.textContent = loadingText || this.options.loadingText;
      
      // Emit loading start
      this.emit('btn:loading:start', { button: this });
    } else {
      // Restore original text
      if (this._currentText) {
        textElement.textContent = this._currentText;
        this._currentText = null;
      }
      
      // Emit loading end
      this.emit('btn:loading:end', { button: this });
    }
  }

  /**
   * Enable button
   */
  enable() {
    this.element.disabled = false;
    this.removeClass(this.element, 'is-disabled');
    this.removeAttribute(this.element, 'aria-disabled');
  }

  /**
   * Disable button
   */
  disable() {
    this.element.disabled = true;
    this.addClass(this.element, 'is-disabled');
    this.setAttribute(this.element, 'aria-disabled', 'true');
  }

  /**
   * Toggle button state
   * @param {boolean} [force] - Force specific state
   */
  toggle(force) {
    const shouldDisable = force !== undefined ? force : !this.element.disabled;
    if (shouldDisable) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Focus button
   */
  focus() {
    this.element.focus();
  }

  /**
   * Blur button
   */
  blur() {
    this.element.blur();
  }

  /**
   * Update button text
   * @param {string} text
   */
  setText(text) {
    const textElement = this.find('.btn__text') || this.element;
    textElement.textContent = text;
    this._originalText = text; // Update stored text
  }

  /**
   * Update button icon
   * @param {string} iconHtml - HTML for the icon
   * @param {string} [position='start'] - Icon position (start/end)
   */
  setIcon(iconHtml, position = 'start') {
    // Remove existing icon
    const existingIcon = this.find('.btn__icon');
    if (existingIcon) {
      existingIcon.remove();
    }
    
    if (!iconHtml) return;
    
    // Create icon wrapper
    const iconWrapper = document.createElement('span');
    iconWrapper.className = `btn__icon btn__icon--${position}`;
    iconWrapper.innerHTML = iconHtml;
    
    // Insert icon
    const textElement = this.find('.btn__text');
    if (textElement) {
      if (position === 'start') {
        this.element.insertBefore(iconWrapper, textElement);
      } else {
        this.element.insertBefore(iconWrapper, textElement.nextSibling);
      }
    } else {
      if (position === 'start') {
        this.element.insertBefore(iconWrapper, this.element.firstChild);
      } else {
        this.element.appendChild(iconWrapper);
      }
    }
  }

  /**
   * Programmatically click button
   */
  click() {
    this.element.click();
  }

  /**
   * Clean up before destroy
   */
  beforeDestroy() {
    // Remove any active ripples
    const ripples = this.findAll('.btn__ripple');
    ripples.forEach(ripple => ripple.remove());
  }
}

// Auto-initialize buttons with data attribute
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-component="button"]');
    buttons.forEach(element => {
      const options = element.dataset.buttonOptions ? 
        JSON.parse(element.dataset.buttonOptions) : {};
      new Button(element, options);
    });
  });
}