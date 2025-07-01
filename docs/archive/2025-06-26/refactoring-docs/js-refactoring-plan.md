# JavaScript Refactoring Plan

## Overview
This document outlines a comprehensive plan to refactor the blog's JavaScript architecture to eliminate redundancy, improve maintainability, and modernize the codebase while preserving all existing functionality.

## Current State Analysis

### Key Metrics
- **Total JS Files**: 19 files across main directory and subdirectories
- **Total Size**: 208KB (unminified)
- **Module Patterns**: 3 different approaches (ES6 modules, IIFE, global functions)
- **DOMContentLoaded Handlers**: 13 separate instances
- **Redundancy**: ~35% of code is duplicated functionality

### Major Issues
1. **Module System Chaos**: Mix of ES6 modules, IIFEs, and global functions
2. **Duplicate Implementations**: Color scheme, device detection, search, tabs
3. **Event Listener Sprawl**: No centralized event management
4. **Initialization Disorder**: 13 separate DOMContentLoaded handlers
5. **Device Detection**: 4 different implementations with inconsistent breakpoints
6. **Global Namespace Pollution**: Numerous window.* assignments

## Refactoring Strategy

### Phase 1: Foundation (Modern Architecture)

#### 1.1 Create Core Application Structure
```javascript
// app/core/App.js
export class App {
  constructor() {
    this.modules = new Map();
    this.config = new Config();
    this.eventBus = new EventBus();
    this.initialized = false;
  }
  
  register(name, module) {
    this.modules.set(name, module);
    return this;
  }
  
  async init() {
    if (this.initialized) return;
    
    // Initialize in dependency order
    await this.initializeCore();
    await this.initializeModules();
    await this.initializeUI();
    
    this.initialized = true;
    this.eventBus.emit('app:ready');
  }
  
  async initializeCore() {
    // Device detection, config, utilities
    await this.modules.get('device').init();
    await this.modules.get('storage').init();
    await this.modules.get('theme').init();
  }
  
  async initializeModules() {
    // Feature modules
    const features = ['search', 'navigation', 'animations'];
    for (const feature of features) {
      const module = this.modules.get(feature);
      if (module) await module.init();
    }
  }
  
  async initializeUI() {
    // UI components
    const components = ['carousel', 'tabs', 'modal', 'dropdown'];
    for (const component of components) {
      const module = this.modules.get(component);
      if (module) await module.init();
    }
  }
}

// Single app instance
export const app = new App();
```

#### 1.2 Configuration Management
```javascript
// app/core/Config.js
export class Config {
  constructor() {
    this.settings = {
      // Breakpoints (single source of truth)
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
      },
      
      // Animation settings
      animations: {
        duration: 200,
        easing: 'ease-in-out'
      },
      
      // Feature flags
      features: {
        soundEffects: true,
        animations: true,
        search: true,
        analytics: false
      },
      
      // API endpoints
      api: {
        search: '/search.json',
        posts: '/api/posts'
      }
    };
  }
  
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.settings);
  }
  
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.settings);
    target[lastKey] = value;
  }
}
```

#### 1.3 Event Bus System
```javascript
// app/core/EventBus.js
export class EventBus {
  constructor() {
    this.events = new Map();
  }
  
  on(event, handler, context = null) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push({ handler, context });
    return () => this.off(event, handler);
  }
  
  off(event, handler) {
    if (!this.events.has(event)) return;
    const handlers = this.events.get(event);
    const index = handlers.findIndex(h => h.handler === handler);
    if (index !== -1) handlers.splice(index, 1);
  }
  
  emit(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach(({ handler, context }) => {
      handler.call(context, data);
    });
  }
  
  once(event, handler, context = null) {
    const wrapper = (data) => {
      handler.call(context, data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
```

### Phase 2: Core Services

#### 2.1 Unified Device Detection
```javascript
// app/services/DeviceService.js
export class DeviceService {
  constructor(config, eventBus) {
    this.config = config;
    this.eventBus = eventBus;
    this.state = {
      type: 'desktop',
      width: window.innerWidth,
      height: window.innerHeight,
      touch: 'ontouchstart' in window,
      retina: window.devicePixelRatio > 1
    };
    this.handlers = new Set();
  }
  
  init() {
    this.updateDevice();
    this.setupListeners();
    this.updateBodyClasses();
  }
  
  setupListeners() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldType = this.state.type;
        this.updateDevice();
        if (oldType !== this.state.type) {
          this.eventBus.emit('device:changed', this.state);
        }
      }, 150);
    });
  }
  
  updateDevice() {
    this.state.width = window.innerWidth;
    this.state.height = window.innerHeight;
    
    const breakpoints = this.config.get('breakpoints');
    if (this.state.width < breakpoints.mobile) {
      this.state.type = 'mobile';
    } else if (this.state.width < breakpoints.tablet) {
      this.state.type = 'tablet';
    } else {
      this.state.type = 'desktop';
    }
  }
  
  updateBodyClasses() {
    const body = document.body;
    body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
    body.classList.add(`device-${this.state.type}`);
    
    if (this.state.touch) body.classList.add('touch-enabled');
    if (this.state.retina) body.classList.add('retina-display');
  }
  
  is(type) {
    return this.state.type === type;
  }
  
  isMobile() {
    return this.state.type === 'mobile';
  }
  
  isTablet() {
    return this.state.type === 'tablet';
  }
  
  isDesktop() {
    return this.state.type === 'desktop';
  }
  
  getState() {
    return { ...this.state };
  }
}
```

#### 2.2 Unified Theme Management
```javascript
// app/services/ThemeService.js
export class ThemeService {
  constructor(storage, eventBus) {
    this.storage = storage;
    this.eventBus = eventBus;
    this.themes = ['light', 'dark', 'auto'];
    this.current = 'auto';
  }
  
  init() {
    this.loadSavedTheme();
    this.applyTheme();
    this.setupListeners();
  }
  
  loadSavedTheme() {
    const saved = this.storage.get('theme');
    if (saved && this.themes.includes(saved)) {
      this.current = saved;
    }
  }
  
  setupListeners() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', () => {
        if (this.current === 'auto') {
          this.applyTheme();
        }
      });
    }
  }
  
  setTheme(theme) {
    if (!this.themes.includes(theme)) return;
    
    const oldTheme = this.current;
    this.current = theme;
    this.storage.set('theme', theme);
    this.applyTheme();
    
    this.eventBus.emit('theme:changed', {
      from: oldTheme,
      to: theme
    });
  }
  
  applyTheme() {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    
    let effectiveTheme = this.current;
    if (this.current === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }
    
    root.classList.add(`theme-${effectiveTheme}`);
    root.setAttribute('data-theme', effectiveTheme);
  }
  
  toggle() {
    const newTheme = this.current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  getTheme() {
    return this.current;
  }
}
```

#### 2.3 Storage Service
```javascript
// app/services/StorageService.js
export class StorageService {
  constructor() {
    this.type = this.detectStorageType();
    this.prefix = 'blog_';
  }
  
  detectStorageType() {
    // Check localStorage availability
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return 'localStorage';
    } catch (e) {
      // Fall back to cookies
      return 'cookie';
    }
  }
  
  get(key) {
    const fullKey = this.prefix + key;
    
    if (this.type === 'localStorage') {
      const value = localStorage.getItem(fullKey);
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } else {
      return this.getCookie(fullKey);
    }
  }
  
  set(key, value) {
    const fullKey = this.prefix + key;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (this.type === 'localStorage') {
      localStorage.setItem(fullKey, stringValue);
    } else {
      this.setCookie(fullKey, stringValue);
    }
  }
  
  remove(key) {
    const fullKey = this.prefix + key;
    
    if (this.type === 'localStorage') {
      localStorage.removeItem(fullKey);
    } else {
      this.deleteCookie(fullKey);
    }
  }
  
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookie = parts.pop().split(';').shift();
      try {
        return JSON.parse(decodeURIComponent(cookie));
      } catch {
        return decodeURIComponent(cookie);
      }
    }
  }
  
  setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }
  
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  }
}
```

### Phase 3: UI Components

#### 3.1 Base Component Class
```javascript
// app/components/Component.js
export class Component {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;
    
    if (!this.element) {
      console.warn(`Component element not found: ${element}`);
      return;
    }
    
    this.options = { ...this.constructor.defaults, ...options };
    this.eventBus = options.eventBus || null;
    this.listeners = new Map();
    this.children = new Set();
    this.initialized = false;
  }
  
  async init() {
    if (this.initialized) return;
    
    await this.setup();
    this.bindEvents();
    this.initialized = true;
    
    if (this.eventBus) {
      this.eventBus.emit(`component:${this.constructor.name}:ready`, this);
    }
  }
  
  async setup() {
    // Override in subclasses
  }
  
  bindEvents() {
    // Override in subclasses
  }
  
  on(element, event, handler, options = {}) {
    const el = typeof element === 'string' 
      ? this.element.querySelector(element) 
      : element;
    
    if (!el) return;
    
    const boundHandler = handler.bind(this);
    el.addEventListener(event, boundHandler, options);
    
    // Store for cleanup
    if (!this.listeners.has(el)) {
      this.listeners.set(el, []);
    }
    this.listeners.get(el).push({ event, handler: boundHandler, options });
  }
  
  off(element, event, handler) {
    const el = typeof element === 'string' 
      ? this.element.querySelector(element) 
      : element;
    
    if (!el || !this.listeners.has(el)) return;
    
    const listeners = this.listeners.get(el);
    const index = listeners.findIndex(l => 
      l.event === event && l.handler === handler
    );
    
    if (index !== -1) {
      const { handler: boundHandler, options } = listeners[index];
      el.removeEventListener(event, boundHandler, options);
      listeners.splice(index, 1);
    }
  }
  
  destroy() {
    // Remove all event listeners
    this.listeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    });
    this.listeners.clear();
    
    // Destroy children
    this.children.forEach(child => child.destroy());
    this.children.clear();
    
    this.initialized = false;
  }
  
  addChild(child) {
    this.children.add(child);
  }
  
  removeChild(child) {
    this.children.delete(child);
  }
}
```

#### 3.2 Unified Search Component
```javascript
// app/components/SearchComponent.js
import { Component } from './Component.js';
import { debounce } from '../utils/helpers.js';

export class SearchComponent extends Component {
  static defaults = {
    minLength: 2,
    debounceDelay: 300,
    placeholder: 'Search...',
    noResultsText: 'No results found',
    searchUrl: '/search.json'
  };
  
  async setup() {
    this.input = this.element.querySelector('.search-input');
    this.results = this.element.querySelector('.search-results');
    this.searchData = null;
    this.isLoading = false;
    
    // Create debounced search
    this.debouncedSearch = debounce(
      this.performSearch.bind(this), 
      this.options.debounceDelay
    );
  }
  
  bindEvents() {
    this.on(this.input, 'input', this.handleInput);
    this.on(this.input, 'focus', this.handleFocus);
    this.on(document, 'click', this.handleOutsideClick);
    
    // Handle keyboard navigation
    this.on(this.element, 'keydown', this.handleKeyboard);
  }
  
  handleInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < this.options.minLength) {
      this.hideResults();
      return;
    }
    
    this.debouncedSearch(query);
  }
  
  async performSearch(query) {
    // Load search data if not already loaded
    if (!this.searchData) {
      await this.loadSearchData();
    }
    
    const results = this.searchInData(query);
    this.displayResults(results, query);
  }
  
  async loadSearchData() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoading();
    
    try {
      const response = await fetch(this.options.searchUrl);
      this.searchData = await response.json();
    } catch (error) {
      console.error('Failed to load search data:', error);
      this.showError();
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }
  
  searchInData(query) {
    if (!this.searchData) return [];
    
    const lowerQuery = query.toLowerCase();
    return this.searchData.filter(item => {
      return item.title.toLowerCase().includes(lowerQuery) ||
             item.content.toLowerCase().includes(lowerQuery) ||
             (item.tags && item.tags.some(tag => 
               tag.toLowerCase().includes(lowerQuery)
             ));
    }).slice(0, 10); // Limit results
  }
  
  displayResults(results, query) {
    if (results.length === 0) {
      this.showNoResults();
      return;
    }
    
    const html = results.map(item => this.renderResult(item, query)).join('');
    this.results.innerHTML = html;
    this.showResults();
  }
  
  renderResult(item, query) {
    // Highlight matching text
    const highlight = (text) => {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };
    
    return `
      <a href="${item.url}" class="search-result">
        <div class="search-result-title">${highlight(item.title)}</div>
        <div class="search-result-excerpt">${highlight(item.excerpt || '')}</div>
      </a>
    `;
  }
  
  showResults() {
    this.results.classList.add('is-visible');
  }
  
  hideResults() {
    this.results.classList.remove('is-visible');
  }
  
  showLoading() {
    this.results.innerHTML = '<div class="search-loading">Loading...</div>';
    this.showResults();
  }
  
  hideLoading() {
    // Handled by search results
  }
  
  showNoResults() {
    this.results.innerHTML = `
      <div class="search-no-results">${this.options.noResultsText}</div>
    `;
    this.showResults();
  }
  
  showError() {
    this.results.innerHTML = `
      <div class="search-error">Error loading search data</div>
    `;
    this.showResults();
  }
  
  handleFocus() {
    if (this.input.value.trim().length >= this.options.minLength) {
      this.showResults();
    }
  }
  
  handleOutsideClick(e) {
    if (!this.element.contains(e.target)) {
      this.hideResults();
    }
  }
  
  handleKeyboard(e) {
    // Add keyboard navigation for results
    if (e.key === 'Escape') {
      this.hideResults();
      this.input.blur();
    }
    // Add arrow key navigation...
  }
}
```

### Phase 4: Utility Functions

#### 4.1 Common Utilities
```javascript
// app/utils/helpers.js
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function fadeIn(element, duration = 300) {
  return new Promise(resolve => {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(animate);
  });
}

export function fadeOut(element, duration = 300) {
  return new Promise(resolve => {
    const start = performance.now();
    const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = initialOpacity * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.opacity = '';
        resolve();
      }
    }
    
    requestAnimationFrame(animate);
  });
}

export function slideToggle(element, duration = 300) {
  if (window.getComputedStyle(element).display === 'none') {
    return slideDown(element, duration);
  } else {
    return slideUp(element, duration);
  }
}

export function slideDown(element, duration = 300) {
  return new Promise(resolve => {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;
    if (display === 'none') display = 'block';
    element.style.display = display;
    
    const height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    element.offsetHeight; // Force reflow
    
    element.style.transition = `height ${duration}ms ease`;
    element.style.height = height + 'px';
    
    setTimeout(() => {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      resolve();
    }, duration);
  });
}

export function slideUp(element, duration = 300) {
  return new Promise(resolve => {
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    element.offsetHeight; // Force reflow
    
    element.style.transition = `height ${duration}ms ease`;
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    
    setTimeout(() => {
      element.style.display = 'none';
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      resolve();
    }, duration);
  });
}

export function isElementInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
  );
}

export function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

export function smoothScrollTo(target, duration = 1000) {
  const targetElement = typeof target === 'string' 
    ? document.querySelector(target)
    : target;
    
  if (!targetElement) return;
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = t => t < 0.5 
      ? 2 * t * t 
      : -1 + (4 - 2 * t) * t;
    
    window.scrollTo(0, startPosition + distance * ease(progress));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}
```

### Phase 5: Main Entry Point

#### 5.1 Refactored Main.js
```javascript
// main.js - New centralized entry point
import { app } from './app/core/App.js';
import { Config } from './app/core/Config.js';
import { EventBus } from './app/core/EventBus.js';

// Services
import { DeviceService } from './app/services/DeviceService.js';
import { StorageService } from './app/services/StorageService.js';
import { ThemeService } from './app/services/ThemeService.js';

// Components
import { SearchComponent } from './app/components/SearchComponent.js';
import { CarouselComponent } from './app/components/CarouselComponent.js';
import { TabsComponent } from './app/components/TabsComponent.js';
import { NavigationComponent } from './app/components/NavigationComponent.js';

// Features
import { BlogModule } from './app/modules/BlogModule.js';
import { ProjectModule } from './app/modules/ProjectModule.js';
import { AnimationsModule } from './app/modules/AnimationsModule.js';

// Initialize app with dependencies
const config = new Config();
const eventBus = new EventBus();
const storage = new StorageService();

// Register core services
app.register('config', config);
app.register('eventBus', eventBus);
app.register('storage', storage);
app.register('device', new DeviceService(config, eventBus));
app.register('theme', new ThemeService(storage, eventBus));

// Register features based on page
if (document.querySelector('.blog')) {
  app.register('blog', new BlogModule(app));
}

if (document.querySelector('.project')) {
  app.register('project', new ProjectModule(app));
}

// Register UI components
const searchEl = document.querySelector('.search-container');
if (searchEl) {
  app.register('search', new SearchComponent(searchEl, { eventBus }));
}

const carouselEls = document.querySelectorAll('.carousel');
carouselEls.forEach((el, index) => {
  app.register(`carousel-${index}`, new CarouselComponent(el, { eventBus }));
});

// Register global features
app.register('navigation', new NavigationComponent({ eventBus }));
app.register('animations', new AnimationsModule({ eventBus, config }));

// Single initialization point
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for debugging/extensions
window.BlogApp = app;
```

## Implementation Plan

### Step 1: Create New Architecture (Week 1)
1. Set up new directory structure: `app/core`, `app/services`, `app/components`
2. Implement core App, Config, and EventBus classes
3. Create base Component class
4. Set up build process for ES6 modules

### Step 2: Migrate Core Services (Week 2)
1. Implement unified DeviceService (replace 4 implementations)
2. Implement unified ThemeService (replace 2 implementations)
3. Create StorageService abstraction
4. Add utility functions module

### Step 3: Refactor Components (Week 3)
1. Convert search to unified SearchComponent
2. Refactor carousel to proper component
3. Convert tabs to reusable TabsComponent
4. Migrate navigation to NavigationComponent

### Step 4: Module Migration (Week 4)
1. Refactor blog.js into BlogModule
2. Refactor project files into ProjectModule
3. Create AnimationsModule from scattered animations
4. Remove all legacy IIFE patterns

### Step 5: Cleanup & Optimization
1. Remove all duplicate implementations
2. Delete legacy files
3. Update build pipeline
4. Add minification and bundling
5. Create documentation

## Expected Results

### Metrics
- **JS File Count**: Reduced from 19 to ~10 core modules
- **Code Size**: ~35% reduction through deduplication
- **Load Time**: Single entry point improves loading
- **Maintainability**: Clear module boundaries
- **Testability**: Proper dependency injection

### Benefits
1. **Single Source of Truth**: No more duplicate implementations
2. **Consistent Patterns**: All modules follow same structure
3. **Better Performance**: Centralized event management
4. **Easier Debugging**: Clear initialization flow
5. **Future-Proof**: Modern ES6 modules ready for bundling

## Migration Guide

### For Existing Features
```javascript
// Old way - scattered initialization
document.addEventListener('DOMContentLoaded', () => {
  initColorScheme();
  initSearch();
  initCarousel();
  // etc...
});

// New way - centralized app
app.register('feature', new FeatureModule(options));
// App handles initialization order
```

### For Event Handling
```javascript
// Old way - direct DOM events
element.addEventListener('click', handler);
// No cleanup, potential memory leaks

// New way - component events
this.on(element, 'click', this.handleClick);
// Automatic cleanup on destroy
```

## Conclusion

This refactoring plan transforms the JavaScript architecture from a collection of scattered scripts into a modern, maintainable application. By implementing proper modules, services, and components, we achieve better performance, maintainability, and developer experience while preserving all existing functionality.