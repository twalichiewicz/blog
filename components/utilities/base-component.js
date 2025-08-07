/**
 * Base Component Class
 * Foundation for all components in the library
 */

export default class Component {
  /**
   * @param {HTMLElement} element - The root element for this component
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('Component requires a valid HTML element');
    }

    this.element = element;
    this.options = { ...this.constructor.defaults, ...options };
    this.state = {};
    this._events = [];
    this._uid = this.constructor._generateUID();
    
    // Store instance reference
    this.constructor.instances.set(this.element, this);
    
    // Initialize
    this.init();
  }

  /**
   * Default options for the component
   * @static
   */
  static defaults = {};

  /**
   * WeakMap to store component instances
   * @static
   */
  static instances = new WeakMap();

  /**
   * Counter for unique IDs
   * @static
   * @private
   */
  static _uidCounter = 0;

  /**
   * Generate unique ID for component instance
   * @static
   * @private
   */
  static _generateUID() {
    return `component-${++this._uidCounter}`;
  }

  /**
   * Get component instance from element
   * @static
   * @param {HTMLElement} element
   * @returns {Component|null}
   */
  static getInstance(element) {
    return this.instances.get(element) || null;
  }

  /**
   * Initialize component
   */
  init() {
    this.setupDOM();
    this.bindEvents();
    this.afterInit();
  }

  /**
   * Setup DOM elements and initial state
   * Override in subclasses
   */
  setupDOM() {
    // Add component identifier
    this.element.dataset.componentId = this._uid;
  }

  /**
   * Bind event listeners
   * Override in subclasses
   */
  bindEvents() {
    // Example of how to track events for cleanup
    // this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  /**
   * Called after initialization
   * Override in subclasses for post-init tasks
   */
  afterInit() {}

  /**
   * Add event listener and track for cleanup
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {Object} options
   */
  addEventListener(target, event, handler, options = {}) {
    target.addEventListener(event, handler, options);
    this._events.push({ target, event, handler, options });
  }

  /**
   * Update component state
   * @param {Object} newState
   */
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.onStateChange(oldState, this.state);
  }

  /**
   * Called when state changes
   * @param {Object} oldState
   * @param {Object} newState
   */
  onStateChange(oldState, newState) {
    // Override in subclasses to react to state changes
  }

  /**
   * Update component options
   * @param {Object} newOptions
   */
  setOptions(newOptions) {
    const oldOptions = { ...this.options };
    this.options = { ...this.options, ...newOptions };
    this.onOptionsChange(oldOptions, this.options);
  }

  /**
   * Called when options change
   * @param {Object} oldOptions
   * @param {Object} newOptions
   */
  onOptionsChange(oldOptions, newOptions) {
    // Override in subclasses to react to option changes
  }

  /**
   * Emit custom event
   * @param {string} eventName
   * @param {*} detail
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    this.element.dispatchEvent(event);
  }

  /**
   * Clean up and destroy component
   */
  destroy() {
    this.beforeDestroy();
    
    // Remove all event listeners
    this._events.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    this._events = [];
    
    // Remove instance reference
    this.constructor.instances.delete(this.element);
    
    // Remove component identifier
    delete this.element.dataset.componentId;
    
    // Call cleanup hook
    this.afterDestroy();
  }

  /**
   * Called before component is destroyed
   * Override in subclasses for cleanup tasks
   */
  beforeDestroy() {}

  /**
   * Called after component is destroyed
   * Override in subclasses for final cleanup
   */
  afterDestroy() {}

  /**
   * Check if element matches selector
   * @param {HTMLElement} element
   * @param {string} selector
   * @returns {boolean}
   */
  matches(element, selector) {
    return element.matches(selector);
  }

  /**
   * Find single element within component
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  find(selector) {
    return this.element.querySelector(selector);
  }

  /**
   * Find all elements within component
   * @param {string} selector
   * @returns {NodeList}
   */
  findAll(selector) {
    return this.element.querySelectorAll(selector);
  }

  /**
   * Add CSS class(es) to element
   * @param {HTMLElement} element
   * @param {...string} classes
   */
  addClass(element, ...classes) {
    element.classList.add(...classes);
  }

  /**
   * Remove CSS class(es) from element
   * @param {HTMLElement} element
   * @param {...string} classes
   */
  removeClass(element, ...classes) {
    element.classList.remove(...classes);
  }

  /**
   * Toggle CSS class on element
   * @param {HTMLElement} element
   * @param {string} className
   * @param {boolean} force
   */
  toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
  }

  /**
   * Check if element has CSS class
   * @param {HTMLElement} element
   * @param {string} className
   * @returns {boolean}
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  }

  /**
   * Set attribute on element
   * @param {HTMLElement} element
   * @param {string} name
   * @param {string} value
   */
  setAttribute(element, name, value) {
    element.setAttribute(name, value);
  }

  /**
   * Remove attribute from element
   * @param {HTMLElement} element
   * @param {string} name
   */
  removeAttribute(element, name) {
    element.removeAttribute(name);
  }

  /**
   * Get attribute value from element
   * @param {HTMLElement} element
   * @param {string} name
   * @returns {string|null}
   */
  getAttribute(element, name) {
    return element.getAttribute(name);
  }
}

// Make available globally for non-module environments
if (typeof window !== 'undefined') {
  window.Component = Component;
}